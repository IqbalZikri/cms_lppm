<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Requests\PkmRequest;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Penulis;
use App\Models\Pkm;
use DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class PkmController extends Controller
{
    use AuthorizesRequests;
    private const PER_PAGE = 10;

    private function stats(Collection $fakultas): array
    {
        $counts = Penulis::where('penulisable_type', Pkm::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        return [
            'total' => Pkm::count(),
            'perFakultas' => $fakultas->map(fn($f) => [
                'label' => $f->nama_fakultas,
                'count' => $counts[$f->id] ?? 0,
            ])->values(),
        ];
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Pkm::class);

        $user = $request->user();
        $filters = $request->only('search', 'cari_fakultas');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $pkm = Pkm::visibleTo($user)
            ->with($this->authorRelations())
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('pkm/index', [
            'data' => $pkm,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewTrashed', Pkm::class);

        $filters = $request->only('search', 'cari_fakultas');

        $pkm = Pkm::onlyTrashed()
            ->visibleTo($request->user())
            ->with($this->authorRelations(withTrashed: true))
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('pkm/dihapus', [
            'pkm' => $pkm,
            'filters' => $filters,
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', pkm::class);

        return Inertia::render('pkm/create', [
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function show(Pkm $pkm, Request $request)
    {
        $this->authorize('view', $pkm);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('pkm.dihapus')
            : route('pkm.index');

        return Inertia::render('pkm/show', [
            'pkm' => $pkm->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl
        ]);
    }

    public function edit(Pkm $pkm)
    {
        $this->authorize('update', $pkm);

        return Inertia::render('pkm/edit', [
            'pkm' => $pkm->load('penulis', 'penulisLuar'),
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function store(PkmRequest $request, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $syncAuthors) {
            $pkm = Pkm::create([
                ...$request->safe()->except('authors'),
                'user_id' => $request->user()->id,
            ]);

            $syncAuthors->handle($pkm, $request->validated('authors'));
        });

        return to_route('pkm.index')->with('success', 'Berhasil menambahkan kegiatan');
    }

    public function update(PkmRequest $request, Pkm $pkm, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $pkm, $syncAuthors) {
            $pkm->update($request->safe()->except('authors'));
            $syncAuthors->handle($pkm, $request->validated('authors'));
        });

        return to_route('pkm.index')->with('success', 'Berhasil memperbarui kegiatan');
    }

    public function destroy(Pkm $kegiatan)
    {
        $this->authorize('delete', $kegiatan);

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->penulis()->delete();
            $kegiatan->penulisLuar()->delete();
            $kegiatan->delete();
        });

        return back()->with('success', 'Berhasil menghapus kegiatan');
    }

    public function restore(Pkm $kegiatan)
    {
        $this->authorize('restore', $kegiatan);

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->penulis()->restore();
            $kegiatan->penulisLuar()->restore();
            $kegiatan->restore();
        });

        return back()->with('success', 'Berhasil memulihkan kegiatan');
    }

    public function forceDelete(Pkm $pkm)
    {
        $this->authorize('forceDelete', $pkm);

        DB::transaction(function () use ($pkm) {
            $pkm->penulis()->forceDelete();
            $pkm->penulisLuar()->forceDelete();
            $pkm->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen kegiatan');
    }

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
