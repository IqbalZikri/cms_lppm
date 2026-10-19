<?php

namespace App\Http\Controllers;

use App\Actions\Hki\SaveHkiAction;
use App\Actions\SyncAuthors;
use App\Enums\StatusPengajuan;
use App\Http\Requests\HkiRequest;
use App\Models\Fakultas;
use App\Models\Hki;
use App\Models\Penulis;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HkiController extends Controller
{
    use AuthorizesRequests;
    private const WITH = ['penulis.fakultas', 'penulis.dosen', 'penulisLuar'];

    public function __construct(private SyncAuthors $syncAuthors)
    {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Hki::class);

        $user = $request->user();

        $data = Hki::visibleTo($user)
            ->with(self::WITH)
            ->search($request->query('search'))
            ->when(
                $user->role === 'admin' && $request->filled('cari_fakultas'),
                fn($q) => $q->whereHas(
                    'penulis',
                    fn($p) => $p->where('fakultas_id', $request->cari_fakultas)
                )
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('hki/index', [
            'data' => $data,
            'filters' => $request->only('search', 'cari_fakultas'),
            ...($user->role === 'admin' ? $this->adminStats() : []),
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewAny', Hki::class);

        $user = $request->user();

        $data = Hki::visibleTo($user)
            ->onlyTrashed()
            ->with(self::WITH)
            ->search($request->query('search'))
            ->when(
                $user->role === 'admin' && $request->filled('cari_fakultas'),
                fn($q) => $q->whereHas(
                    'penulis',
                    fn($p) => $p->where('fakultas_id', $request->cari_fakultas)
                )
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render($this->page('dihapus'), [
            'data' => $data,
            'filters' => $request->only('search', 'cari_fakultas'),
            ...($user->role === 'admin' ? $this->adminStats() : []),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Hki::class);

        return Inertia::render("hki/create", $this->formProps());
    }

    public function store(HkiRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $hki = $request->user()->hki()->create($request->hkiData());
                $this->syncAuthors->handle($hki, $request->authors());
            });
        } catch (\Throwable $e) {
            return $this->failed($e);
        }

        return $this->redirectIndex($request->isDraft()
            ? 'Draft berhasil disimpan'
            : ($request->user()->role === 'admin'
                ? 'Berhasil menambahkan HKI'
                : 'Pengajuan HKI berhasil dikirim'));
    }


    public function update(HkiRequest $request, Hki $hki)
    {
        try {
            DB::transaction(function () use ($request, $hki) {
                $hki->update($request->hkiData());
                $this->syncAuthors->handle($hki, $request->authors());
            });
        } catch (\Throwable $e) {
            return $this->failed($e);
        }

        return $this->redirectIndex($request->isDraft()
            ? 'Draft berhasil disimpan'
            : ($request->user()->role === 'admin'
                ? 'Berhasil mengupdate HKI'
                : 'Pengajuan HKI berhasil dikirim'));
    }

    public function show(Hki $hki, Request $request)
    {
        $this->authorize('view', $hki);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('luaran_jurnal.dihapus')
            : route('luaran_jurnal.index');

        return Inertia::render($this->page('show'), [
            'data' => $hki->load(self::WITH),
        ]);
    }

    public function edit(Hki $hki)
    {
        $this->authorize('update', $hki);

        return Inertia::render($this->page('edit'), [
            'data' => $hki->load('penulis', 'penulisLuar'),
            ...$this->formProps(),
        ]);
    }

    public function updateStatus(Request $request, Hki $hki)
    {
        $this->authorize('updateStatus', $hki);

        $status = $request->validate([
            'status_pengajuan' => ['required', Rule::enum(StatusPengajuan::class)],
        ])['status_pengajuan'];

        $hki->update(['status_pengajuan' => $status]);

        return back()->with('success', "Pengajuan HKI berhasil {$status}");
    }

    public function destroy(Hki $hki)
    {
        $this->authorize('delete', $hki);

        try {
            DB::transaction(function () use ($hki) {
                $hki->penulis()->delete();
                $hki->penulisLuar()->delete();
                $hki->delete();
            });
        } catch (\Throwable $e) {
            return $this->failed($e);
        }

        return back()->with('success', 'Berhasil menghapus HKI');
    }

    public function restore(Hki $hki)
    {
        $this->authorize('restore', $hki);

        DB::transaction(function () use ($hki) {
            $hki->penulis()->restore();
            $hki->penulisLuar()->restore();
            $hki->restore();
        });

        return back()->with('success', 'Berhasil memulihkan hki');
    }

    /* ---------- helpers ---------- */

    private function page(string $name): string
    {
        return auth()->user()->role . "/hki/{$name}";
    }

    private function formProps(): array
    {
        return [
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
            'user' => auth()->user()->only('id', 'role'),
        ];
    }

    private function adminStats(): array
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $perJenis = Hki::query()->selectRaw('jenis_hki, count(*) as total')
            ->groupBy('jenis_hki')->pluck('total', 'jenis_hki');
        $perFakultas = Penulis::where('penulisable_type', Hki::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')->pluck('total', 'fakultas_id');

        return [
            'fakultas' => $fakultas,
            'totalPaten' => $perJenis['paten'] ?? 0,
            'totalHaki' => $perJenis['haki'] ?? 0,
            'totalHki' => $perJenis->sum(),
            'totalHkiPerFakultas' => $fakultas->map(fn($f) => [
                'label' => $f->nama_fakultas,
                'count' => $perFakultas[$f->id] ?? 0,
            ])->values(),
        ];
    }

    private function redirectIndex(string $message)
    {
        return redirect()
            ->route(auth()->user()->role . '.hki.index')
            ->with('success', $message);
    }

    private function failed(\Throwable $e)
    {
        Log::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);

        return back()->with('error', 'Terjadi Kesalahan');
    }
}