<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Hki;
use App\Models\Kategori;
use App\Models\Kegiatan;
use App\Models\LuaranBuku;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Log;

class PublicController extends Controller
{
    public function beranda()
    {
        $berita = Berita::latest()->take(5)->get();
        $penelitian = $this->merge([
            $this->countPerPeriod(Kegiatan::class),
            $this->countPerPeriod(Hki::class),
        ]);
        // Hitung jumlah data per periode, hasilnya: ['2023/1' => 5, '2023/2' => 8, ...]

        $publikasi = $this->merge([
            $this->countPerPeriod(LuaranJurnal::class),
            $this->countPerPeriod(LuaranProsiding::class),
        ]);

        $pkm = $this->countPerPeriod(Pkm::class);

        // Daftar semua periode dari yang paling awal sampai terakhir
        $periods = $this->buildPeriods([$penelitian, $publikasi, $pkm]);

        // Susun data + hitung kumulatif
        $runPen = $runPub = $runPkm = 0;

        $chart = $periods->map(function ($p) use ($penelitian, $publikasi, $pkm, &$runPen, &$runPub, &$runPkm) {
            $runPen += $penelitian[$p] ?? 0;
            $runPub += $publikasi[$p] ?? 0;
            $runPkm += $pkm[$p] ?? 0;

            return [
                'periode' => $p,        // "2023/1"
                'penelitian' => $runPen,
                'publikasi' => $runPub,
                'pkm' => $runPkm,
            ];
        })->values();

        return Inertia::render('public/beranda', [
            'chart' => $chart,
            'stats' => [
                ['value' => Kegiatan::count(), 'label' => 'Penelitian aktif'],
                ['value' => LuaranJurnal::count() + LuaranProsiding::count(), 'label' => 'Publikasi ilmiah'],
                ['value' => Pkm::count(), 'label' => 'Program pengabdian'],
            ],
            'berita' => $berita
        ]);
    }

    /** Hitung jumlah baris per (tahun, semester). */
    private function countPerPeriod(string $model): Collection
    {
        return $model::query()
            ->selectRaw('tahun, semester, COUNT(*) as total')
            ->where('tahun', '>=', now()->year - 3)
            ->groupBy('tahun', 'semester')
            ->get()
            ->mapWithKeys(function ($row) {
                $sem = strtolower($row->semester) === 'ganjil' ? 1 : 2;
                return ["{$row->tahun}/{$sem}" => (int) $row->total];
            });
    }

    /** Gabungkan beberapa collection periode dengan menjumlahkan nilainya. */
    private function merge(array $collections): Collection
    {
        $result = collect();
        foreach ($collections as $c) {
            foreach ($c as $periode => $total) {
                $result[$periode] = ($result[$periode] ?? 0) + $total;
            }
        }
        return $result;
    }

    /** Buat daftar periode berurutan tanpa celah (2023/1, 2023/2, 2024/1, ...). */
    private function buildPeriods(array $sources): Collection
    {
        $keys = collect($sources)->flatMap(fn($s) => $s->keys());
        if ($keys->isEmpty()) {
            return collect();
        }

        $years = $keys->map(fn($k) => (int) explode('/', $k)[0]);

        return collect(range($years->min(), $years->max()))
            ->flatMap(fn($y) => ["{$y}/1", "{$y}/2"]);
    }

    public function profil()
    {
        $visi = SiteSettings::where("setting_key", "vision")->value('setting_value');
        $misi = SiteSettings::where("setting_key", "mission")->value('setting_value');

        preg_match_all('/<li.*?>(.*?)<\/li>/si', $misi, $matches);

        $misiList = array_map(function ($item) {
            return strip_tags($item);
        }, $matches[1]);

        return Inertia::render("public/profil/visi-misi", [
            'visi' => $visi,
            'misi' => $misiList,
        ]);
    }

    private function formatBerita(Berita $b): array
    {
        return [
            'id' => $b->id,
            'judul' => $b->judul_berita,
            'ringkasan' => $b->ringkasan_berita,
            'gambar' => $b->gambar ? asset('storage/' . $b->gambar) : null,
            'kategori' => $b->kategori?->nama_kategori,
            'tanggal' => $b->published_at?->translatedFormat('d F Y'),
            'slug' => $b->slug,
            'views' => $b->views,
        ];
    }

    private function beritaTayang()
    {
        return Berita::with('kategori:id,nama_kategori')->tayang();
    }

    public function berita(Request $request): Response
    {
        $berita = $this->beritaTayang()
            ->when($request->q, fn($q, $v) => $q->where('judul_berita', 'like', "%{$v}%"))
            ->when($request->kategori, fn($q, $v) => $q->where('kategori_id', $v))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(fn($b) => $this->formatBerita($b));

        return Inertia::render('public/berita/index', [
            'berita' => $berita,
            'kategori' => Kategori::orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'filters' => $request->only('q', 'kategori'),
        ]);
    }

    public function beritaDetail(string $slug): Response
    {
        $berita = $this->beritaTayang()->where('slug', $slug)->firstOrFail();
        $berita->increment('views');

        $terkait = $this->beritaTayang()
            ->where('kategori_id', $berita->kategori_id)
            ->whereKeyNot($berita->id)
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        return Inertia::render('public/berita/show', [
            'berita' => $this->formatBerita($berita) + ['isi' => $berita->isi_berita],
            'terkait' => $terkait,
        ]);
    }

    private function formatPenelitian($m, string $kunci, string $label): array
    {
        $dalam = $m->penulis->map(fn($p) => [
            'nama' => $p->dosen?->nama_dosen,
            'afiliasi' => $p->fakultas?->nama_fakultas,
        ]);

        $luar = $m->penulisLuar->map(fn($p) => [
            'nama' => $p->nama_dosen,
            'afiliasi' => $p->nama_universitas,
        ]);

        return [
            'id' => "{$kunci}-{$m->id}",
            'judul' => $m->judul,
            'tahun' => $m->tahun,
            'semester' => $m->semester,
            'jenis' => $label,
            'penulis' => $dalam->concat($luar)->filter(fn($x) => $x['nama'])->values(),
        ];
    }

    public function penelitian(Request $request): Response
    {
        $jenis = in_array($request->jenis, ['kegiatan', 'hki']) ? $request->jenis : null;
        $model = ['kegiatan' => [Kegiatan::class, 'Kegiatan'], 'hki' => [Hki::class, 'HKI']];

        $items = collect($model)
            ->filter(fn($_, $k) => !$jenis || $jenis === $k)
            ->flatMap(function ($cfg, $k) use ($request) {
                [$kelas, $label] = $cfg;

                return $kelas::with(['penulis.dosen', 'penulis.fakultas', 'penulisLuar'])
                    ->when($request->q, fn($q, $v) => $q->where('judul', 'ilike', "%{$v}%"))
                    ->when($request->tahun, fn($q, $v) => $q->where('tahun', $v))
                    ->get()
                    ->map(fn($m) => $this->formatPenelitian($m, $k, $label));
            })
            ->sortBy([['tahun', 'desc'], ['judul', 'asc']])
            ->values();

        $perPage = 10;
        $page = LengthAwarePaginator::resolveCurrentPage();
        $daftar = new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );

        // Data grafik: jumlah per tahun (6 tahun terakhir)
        $hitung = fn($kelas) => $kelas::selectRaw('tahun, count(*) as total')->groupBy('tahun')->pluck('total', 'tahun');
        $k = $hitung(Kegiatan::class);
        $h = $hitung(Hki::class);
        $tahun = $k->keys()->merge($h->keys())->unique()->sort()->values();

        return Inertia::render('public/penelitian', [
            'penelitian' => $daftar,
            'grafik' => $tahun->map(fn($t) => [
                'tahun' => (string) $t,
                'kegiatan' => (int) ($k[$t] ?? 0),
                'hki' => (int) ($h[$t] ?? 0),
            ])->slice(-6)->values(),
            'daftarTahun' => $tahun->reverse()->values(),
            'filters' => $request->only('q', 'jenis', 'tahun'),
        ]);
    }

    // Satu-satunya tempat yang perlu disesuaikan dengan model luaran kamu
    private array $luaran = [
        'jurnal' => ['model' => LuaranJurnal::class, 'label' => 'Jurnal', 'venue' => 'nama_jurnal'],
        'prosiding' => ['model' => LuaranProsiding::class, 'label' => 'Prosiding', 'venue' => 'nama_prosiding'],
        'buku' => ['model' => LuaranBuku::class, 'label' => 'Buku', 'venue' => 'penerbit'],
    ];

    private function formatLuaran($m, string $kunci, array $cfg): array
    {
        $dalam = $m->penulis->map(fn($p) => [
            'nama' => $p->dosen?->nama_dosen,
            'afiliasi' => $p->fakultas?->nama_fakultas,
        ]);
        $luar = $m->penulisLuar->map(fn($p) => [
            'nama' => $p->nama_dosen,
            'afiliasi' => $p->nama_universitas,
        ]);

        // Hanya terima tautan http(s), supaya tidak ada "javascript:" yang lolos
        $link = $m->link ?? null;

        return [
            'id' => "{$kunci}-{$m->id}",
            'judul' => $m->judul,
            'tahun' => $m->tahun,
            'jenis' => $kunci,
            'label' => $cfg['label'],
            'venue' => $m->{$cfg['venue']} ?? null,
            'link' => $link && preg_match('#^https?://#i', $link) ? $link : null,
            'penulis' => $dalam->concat($luar)->filter(fn($x) => $x['nama'])->values(),
        ];
    }

    public function publikasi(Request $request): Response
    {
        $jenis = array_key_exists($request->jenis, $this->luaran) ? $request->jenis : null;

        $items = collect($this->luaran)
            ->filter(fn($_, $k) => !$jenis || $jenis === $k)
            ->flatMap(fn($cfg, $k) => $cfg['model']::with(['penulis.dosen', 'penulis.fakultas', 'penulisLuar'])
                ->when($request->q, fn($q, $v) => $q->where('judul', 'ilike', "%{$v}%"))
                ->when($request->tahun, fn($q, $v) => $q->where('tahun', $v))
                ->get()
                ->map(fn($m) => $this->formatLuaran($m, $k, $cfg)))
            ->sortBy([['tahun', 'desc'], ['judul', 'asc']])
            ->values();

        $perPage = 10;
        $page = LengthAwarePaginator::resolveCurrentPage();
        $daftar = new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );

        // Grafik: jumlah per tahun untuk tiap jenis (6 tahun terakhir)
        $hitung = collect($this->luaran)->map(fn($c) => $c['model']::selectRaw('tahun, count(*) as total')
            ->groupBy('tahun')->pluck('total', 'tahun'));
        $tahun = $hitung->flatMap(fn($h) => $h->keys())->unique()->sort()->values();

        return Inertia::render('public/publikasi', [
            'publikasi' => $daftar,
            'grafik' => $tahun->map(fn($t) => ['tahun' => (string) $t]
                + $hitung->map(fn($h) => (int) ($h[$t] ?? 0))->all())->slice(-6)->values(),
            'daftarTahun' => $tahun->reverse()->values(),
            'filters' => $request->only('q', 'jenis', 'tahun'),
        ]);
    }

    private function formatPenulis($m)
    {
        $dalam = $m->penulis->map(fn($p) => [
            'nama' => $p->dosen?->nama_dosen,
            'afiliasi' => $p->fakultas?->nama_fakultas,
        ]);
        $luar = $m->penulisLuar->map(fn($p) => [
            'nama' => $p->nama_dosen,
            'afiliasi' => $p->nama_universitas,
        ]);

        return $dalam->concat($luar)->filter(fn($x) => $x['nama'])->values();
    }

    public function pkm(Request $request): Response
    {
        $daftar = Pkm::with(['penulis.dosen', 'penulis.fakultas', 'penulisLuar'])
            ->when($request->q, fn($q, $v) => $q->where('judul', 'ilike', "%{$v}%"))
            ->when($request->jenis, fn($q, $v) => $q->where('jenis_pkm', $v))
            ->when($request->tahun, fn($q, $v) => $q->where('tahun', $v))
            ->orderByDesc('tahun')
            ->orderBy('judul')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($m) => [
                'id' => $m->id,
                'judul' => $m->judul,
                'tahun' => $m->tahun,
                'semester' => $m->semester,
                'jenis' => $m->jenis_pkm,
                'penulis' => $this->formatPenulis($m),
            ]);

        $perTahun = Pkm::selectRaw('tahun, count(*) as total')->groupBy('tahun')->orderBy('tahun')->pluck('total', 'tahun');

        return Inertia::render('public/pkm', [
            'pkm' => $daftar,
            'grafik' => $perTahun->map(fn($total, $tahun) => ['tahun' => (string) $tahun, 'total' => (int) $total])
                ->values()->slice(-6)->values(),
            'daftarTahun' => $perTahun->keys()->reverse()->values(),
            'daftarJenis' => Pkm::whereNotNull('jenis_pkm')->distinct()->orderBy('jenis_pkm')->pluck('jenis_pkm'),
            'filters' => $request->only('q', 'jenis', 'tahun'),
        ]);
    }

    private function urlAman(?string $url): ?string
    {
        // Hanya terima tautan http(s)
        return $url && preg_match('#^https?://#i', $url) ? $url : null;
    }

    public function kontak(): Response
    {
        $s = SiteSettings::pluck('setting_value', 'setting_key');

        return Inertia::render('public/kontak', [
            'kontak' => [
                'telepon' => $s['telepon'] ?? null,
                'whatsapp' => $s['whatsapp_number'] ?? null,
                'email' => $s['email'] ?? null,
                'alamat' => $s['alamat'] ?? null,
                'sosmed' => [
                    'facebook' => $this->urlAman($s['facebook_url'] ?? null),
                    'instagram' => $this->urlAman($s['instagram_url'] ?? null),
                    'twitter' => $this->urlAman($s['twitter_url'] ?? null),
                ],
            ],
        ]);
    }
}
