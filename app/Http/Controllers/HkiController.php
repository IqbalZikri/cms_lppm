<?php

namespace App\Http\Controllers;

use App\Enums\StatusPengajuan;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use App\Models\Penulis;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class HkiController extends Controller
{
    private function messages(): array
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal :max karakter.',
            'jenis_hki.required' => 'Pilih jenis HKI terlebih dahulu.',
            'abstrak.required' => 'Abstrak wajib diisi.',
            'semester.in' => 'Semester harus Ganjil atau Genap.',
            'tahun.integer' => 'Tahun harus berupa angka.',
            'link_berkas.required' => 'Link berkas wajib diisi.',
            'link_berkas.url' => 'Format link berkas tidak valid.',
            'authors.required' => 'Minimal harus ada satu penulis.',
            'authors.min' => 'Minimal harus ada :min penulis.',
            'nomer_paten.required_if' => 'Nomor paten wajib diisi jika jenis HKI berupa paten.',
            'nomer_pengajuan_haki.required_if' => 'Nomor pengajuan HAKI wajib diisi jika jenis HKI berupa HAKI.',
        ];
    }

    private function attributes(): array
    {
        return [
            'link_berkas' => 'link berkas',
            'jenis_hki' => 'jenis HKI',
        ];
    }

    private function draftRules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'], // agar draft bisa dikenali di daftar
            'jenis_hki' => ['nullable', 'string'],
            'abstrak' => ['nullable', 'string'],
            'semester' => ['nullable', 'in:Ganjil,Genap'],
            'tahun' => ['nullable', 'integer'],
            'link_berkas' => ['nullable', 'url'],
            'authors' => ['nullable', 'array'],
        ];
    }

    private function submitRules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:255'],
            'jenis_hki' => ['required', 'string'],
            'abstrak' => ['required', 'string'],
            'semester' => ['required', 'in:Ganjil,Genap'],
            'tahun' => ['required', 'integer'],
            'link_berkas' => ['required', 'url'],
            'authors' => ['required', 'array', 'min:1'],
            'nomer_paten' => ['required_if:jenis_hki,paten', 'string'],
            'nomer_pengajuan_haki' => ['required_if:jenis_hki,haki', 'string'],
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function indexAdmin(Request $request)
    {
        $queryHki = Hki::query()->with('penulis.fakultas', 'penulis.dosen', 'penulisLuar');

        $queryHki->where(function ($q) {
            $q->where('status_pengajuan', '!=', 'draft')
                ->orWhereNull('status_pengajuan')
                ->orWhere('user_id', auth()->id());
        });

        if ($request->filled('cari_fakultas')) {
            $queryHki->whereHas('penulis', function ($q) use ($request) {
                $q->where('fakultas_id', $request->cari_fakultas);
            });
        }

        $data = $queryHki->clone()->search($request->query("search"))->latest()->paginate(10)->withQueryString();
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $totalPaten = Hki::where('jenis_hki', 'paten')->count();
        $totalHaki = Hki::where('jenis_hki', 'haki')->count();
        $totalHki = Hki::count();
        $counts = Penulis::where('penulisable_type', Hki::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        $totalHkiPerFakultas = $fakultas->map(fn($f) => [
            'label' => $f->nama_fakultas,
            'count' => $counts[$f->id] ?? 0,
        ])->values();

        return Inertia::render('admin/hki/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            'totalPaten' => $totalPaten,
            'totalHaki' => $totalHaki,
            "filters" => $request->only("search", "cari_fakultas"),
            "totalHkiPerFakultas" => $totalHkiPerFakultas,
            "totalHki" => $totalHki
        ]);
    }

    public function indexDosen(Request $request)
    {
        $data = Hki::where("user_id", auth()->user()->id)->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen', 'penulisLuar')->latest()->paginate(10)->withQueryString();
        return Inertia::render('dosen/hki/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function indexUppm(Request $request)
    {
        $data = Hki::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen', 'penulisLuar')->latest()->paginate(10)->withQueryString();
        return Inertia::render('uppm/hki/index', [
            'data' => $data,
            'filters' => $request->only("search")
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $user = auth()->user()->only("id", "role");
        return Inertia::render('admin/hki/create', [
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    public function dosenCreate()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $user = auth()->user()->only("id", "role");
        return Inertia::render('dosen/hki/create', [
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    public function createRoleUppm()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $user = auth()->user()->only("id", "role");
        return Inertia::render('uppm/hki/create', [
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $isDraft = $request->input('action') === 'draft';

        $data = $request->validate($isDraft ? $this->draftRules() : $this->submitRules(), $this->messages(), $this->attributes());
        if (auth()->user()->role === "admin") {
            $data['status_pengajuan'] = $isDraft ? StatusPengajuan::Draft : StatusPengajuan::Disetujui;
        } else {
            $data['status_pengajuan'] = $isDraft ? StatusPengajuan::Draft : StatusPengajuan::Diajukan;
        }

        DB::beginTransaction();

        try {

            $hki = $request->user()->hki()->create($data);

            foreach ($request->input('authors', []) as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    if (empty($author['fakultas_id']) || empty($author['dosen_id']))
                        continue;
                    $hki->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    if (empty($author['nama_universitas']) || empty($author['nama_dosen']))
                        continue;
                    $hki->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            $message = match (true) {
                $isDraft => 'Draft berhasil disimpan',
                auth()->user()->role === 'admin' => 'Berhasil menambahkan HKI',
                default => 'Pengajuan HKI berhasil dikirim',
            };

            return redirect()->route(auth()->user()->role . '.hki.index')->with('success', $message);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Hki $hki)
    {
        $hki->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        return Inertia::render('admin/hki/show', [
            'data' => $hki,
            "role" => auth()->user()->role
        ]);
    }

    public function showRoleDosen(Hki $hki)
    {
        $hki->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        return Inertia::render('dosen/hki/show', [
            'data' => $hki,
            "role" => auth()->user()->role
        ]);
    }

    public function showRoleUppm(Hki $hki)
    {
        $hki->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        return Inertia::render('uppm/hki/show', [
            'data' => $hki,
            "role" => auth()->user()->role
        ]);
    }

    public function updateStatusPengajuan(Request $request, $id)
    {
        $data = Hki::findOrFail($id);

        try {
            $data->update([
                "status_pengajuan" => $request->status_pengajuan
            ]);

            return back()->with("success", "Pengajuan HKI berhasil " . $request->status_pengajuan);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with("error", "Terjadi Kesalahan");
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hki $hki)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $hki->load('penulis', 'penulisLuar');
        $user = auth()->user();
        return Inertia::render('admin/hki/edit', [
            'data' => $hki,
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    public function editRoleDosen(Hki $hki)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $hki->load('penulis', 'penulisLuar');
        $user = auth()->user();
        return Inertia::render('dosen/hki/edit', [
            'data' => $hki,
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    public function editRoleUppm(Hki $hki)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $hki->load('penulis', 'penulisLuar');
        $user = auth()->user();
        return Inertia::render('uppm/hki/edit', [
            'data' => $hki,
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hki $hki)
    {
        $isDraft = $request->input('action') === 'draft';

        $data = $request->validate($isDraft ? $this->draftRules() : $this->submitRules(), $this->messages(), $this->attributes());
        if (auth()->user()->role === "admin") {
            $data['status_pengajuan'] = $isDraft ? StatusPengajuan::Draft : StatusPengajuan::Disetujui;
        } else {
            $data['status_pengajuan'] = $isDraft ? StatusPengajuan::Draft : StatusPengajuan::Diajukan;
        }
        DB::beginTransaction();

        try {

            $hki->update($data);

            $hki->penulis()->delete();
            $hki->penulisLuar()->delete();

            foreach ($request->input('authors', []) as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    if (empty($author['fakultas_id']) || empty($author['dosen_id']))
                        continue;
                    $hki->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    if (empty($author['nama_universitas']) || empty($author['nama_dosen']))
                        continue;
                    $hki->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            $message = match (true) {
                $isDraft => 'Draft berhasil disimpan',
                auth()->user()->role === 'admin' => 'Berhasil mengupdate HKI',
                default => 'Pengajuan HKI berhasil dikirim',
            };

            return redirect()->route(auth()->user()->role . '.hki.index')->with('success', $message);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hki $hki)
    {
        try {
            $hki->penulis()->delete();
            $hki->penulisLuar()->delete();
            $hki->delete();
            return back()->with('success', 'Berhasil menghapus HKI');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
