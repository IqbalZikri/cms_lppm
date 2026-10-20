<?php

namespace App\Http\Controllers;

use App\Actions\SyncKegiatanAuthors;
use App\Http\Requests\KegiatanRequest;
use App\Models\Fakultas;
use App\Models\Kegiatan;
use App\Models\Penulis;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

class KegiatanController extends Controller
{
    use AuthorizesRequests;
    private const PER_PAGE = 10;

    public function index(Request $request)
    {
        $this->authorize('viewAny', Kegiatan::class);

        $user = $request->user();
        $filters = $request->only('search', 'cari_fakultas');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $kegiatan = Kegiatan::visibleTo($user)
            ->with($this->authorRelations())
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        $role = auth()->user()->role;

        return Inertia::render('kegiatan/index', [
            'kegiatan' => $kegiatan,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
            'role' => $role
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewTrashed', Kegiatan::class);

        $filters = $request->only('search', 'cari_fakultas');

        $kegiatan = Kegiatan::onlyTrashed()
            ->visibleTo($request->user())
            ->with($this->authorRelations(withTrashed: true))
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('kegiatan/dihapus', [
            'kegiatan' => $kegiatan,
            'filters' => $filters,
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Kegiatan::class);

        return Inertia::render('kegiatan/create', [
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function show(Kegiatan $kegiatan, Request $request)
    {
        $this->authorize('view', $kegiatan);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('kegiatan.dihapus')
            : route('kegiatan.index');

        return Inertia::render('kegiatan/show', [
            'kegiatan' => $kegiatan->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl
        ]);
    }

    public function edit(Kegiatan $kegiatan)
    {
        $this->authorize('update', $kegiatan);

        return Inertia::render('kegiatan/edit', [
            'kegiatan' => $kegiatan->load('penulis', 'penulisLuar'),
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function store(KegiatanRequest $request, SyncKegiatanAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $syncAuthors) {
            $kegiatan = Kegiatan::create([
                ...$request->safe()->except('authors'),
                'user_id' => $request->user()->id,
            ]);

            $syncAuthors->handle($kegiatan, $request->validated('authors'));
        });

        return to_route('kegiatan.index')->with('success', 'Berhasil menambahkan kegiatan');
    }

    public function update(KegiatanRequest $request, Kegiatan $kegiatan, SyncKegiatanAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $kegiatan, $syncAuthors) {
            $kegiatan->update($request->safe()->except('authors'));
            $syncAuthors->handle($kegiatan, $request->validated('authors'));
        });

        return to_route('kegiatan.index')->with('success', 'Berhasil memperbarui kegiatan');
    }

    public function destroy(Kegiatan $kegiatan)
    {
        $this->authorize('delete', $kegiatan);

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->penulis()->delete();
            $kegiatan->penulisLuar()->delete();
            $kegiatan->delete();
        });

        return back()->with('success', 'Berhasil menghapus kegiatan');
    }

    public function restore(Kegiatan $kegiatan)
    {
        $this->authorize('restore', $kegiatan);

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->penulis()->restore();
            $kegiatan->penulisLuar()->restore();
            $kegiatan->restore();
        });

        return back()->with('success', 'Berhasil memulihkan kegiatan');
    }

    public function forceDelete(Kegiatan $kegiatan)
    {
        $this->authorize('forceDelete', $kegiatan);

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->penulis()->forceDelete();
            $kegiatan->penulisLuar()->forceDelete();
            $kegiatan->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen kegiatan');
    }

    /**
     * Statistik kegiatan (khusus admin).
     */
    private function stats(Collection $fakultas): array
    {
        $counts = Penulis::where('penulisable_type', Kegiatan::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        return [
            'total' => Kegiatan::count(),
            'perFakultas' => $fakultas->map(fn($f) => [
                'label' => $f->nama_fakultas,
                'count' => $counts[$f->id] ?? 0,
            ])->values(),
        ];
    }

    /**
     * Relasi penulis yang di-load. Untuk data terhapus, penulisnya
     * ikut di-soft-delete sehingga harus pakai withTrashed().
     */
    private function authorRelations(bool $withTrashed = false): array
    {
        if (!$withTrashed) {
            return ['penulis.fakultas', 'penulis.dosen', 'penulisLuar'];
        }

        return [
            'penulis' => fn($q) => $q->withTrashed(),
            'penulis.dosen',
            'penulis.fakultas',
            'penulisLuar' => fn($q) => $q->withTrashed(),
        ];
    }
}