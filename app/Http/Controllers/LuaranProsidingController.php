<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Controllers\Controller;
use App\Http\Requests\LuaranProsidingRequest;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranProsiding;
use App\Models\Penulis;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranProsidingController extends Controller
{
    use AuthorizesRequests;

    private const PER_PAGE = 10;


    public function index(Request $request)
    {
        $this->authorize('viewAny', LuaranProsiding::class);

        $user = $request->user();
        $filters = $request->only('search', 'cari_fakultas');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $luaranProsiding = LuaranProsiding::visibleTo($user)
            ->with($this->authorRelations())
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        $role = auth()->user()->role;

        return Inertia::render('luaran-prosiding/index', [
            'data' => $luaranProsiding,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
            'role' => $role
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewTrashed', LuaranProsiding::class);

        $filters = $request->only('search', 'cari_fakultas');

        $luaranProsiding = LuaranProsiding::onlyTrashed()
            ->visibleTo($request->user())
            ->with($this->authorRelations(withTrashed: true))
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('luaran-prosiding/dihapus', [
            'data' => $luaranProsiding,
            'filters' => $filters,
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', LuaranProsiding::class);

        return Inertia::render('luaran-prosiding/create', [
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function show(LuaranProsiding $LuaranProsiding, Request $request)
    {
        $this->authorize('view', $LuaranProsiding);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('luaran_prosiding.dihapus')
            : route('luaran_prosiding.index');

        return Inertia::render('luaran-prosiding/show', [
            'data' => $LuaranProsiding->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl
        ]);
    }

    public function edit(LuaranProsiding $LuaranProsiding)
    {
        $this->authorize('update', $LuaranProsiding);

        return Inertia::render('luaran-prosiding/edit', [
            'data' => $LuaranProsiding->load('penulis', 'penulisLuar'),
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function store(LuaranProsidingRequest $request, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $syncAuthors) {
            $LuaranProsiding = LuaranProsiding::create([
                ...$request->safe()->except('authors'),
                'user_id' => $request->user()->id,
            ]);

            $syncAuthors->handle($LuaranProsiding, $request->validated('authors'));
        });

        return to_route('luaran_prosiding.index')->with('success', 'Berhasil menambahkan luaran prosiding');
    }

    public function update(LuaranProsidingRequest $request, LuaranProsiding $LuaranProsiding, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $LuaranProsiding, $syncAuthors) {
            $LuaranProsiding->update($request->safe()->except('authors'));
            $syncAuthors->handle($LuaranProsiding, $request->validated('authors'));
        });

        return to_route('luaran_prosiding.index')->with('success', 'Berhasil memperbarui luaran prosiding');
    }

    public function destroy(LuaranProsiding $LuaranProsiding)
    {
        $this->authorize('delete', $LuaranProsiding);

        DB::transaction(function () use ($LuaranProsiding) {
            $LuaranProsiding->penulis()->delete();
            $LuaranProsiding->penulisLuar()->delete();
            $LuaranProsiding->delete();
        });

        return back()->with('success', 'Berhasil menghapus luaran prosiding');
    }

    public function restore(LuaranProsiding $LuaranProsiding)
    {
        $this->authorize('restore', $LuaranProsiding);

        DB::transaction(function () use ($LuaranProsiding) {
            $LuaranProsiding->penulis()->restore();
            $LuaranProsiding->penulisLuar()->restore();
            $LuaranProsiding->restore();
        });

        return back()->with('success', 'Berhasil memulihkan luaran prosiding');
    }

    public function forceDelete(LuaranProsiding $LuaranProsiding)
    {
        $this->authorize('forceDelete', $LuaranProsiding);

        DB::transaction(function () use ($LuaranProsiding) {
            $LuaranProsiding->penulis()->forceDelete();
            $LuaranProsiding->penulisLuar()->forceDelete();
            $LuaranProsiding->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen luaran prosiding');
    }

    /**
     * Statistik LuaranProsiding (khusus admin).
     */
    private function stats(Collection $fakultas): array
    {
        $counts = Penulis::where('penulisable_type', LuaranProsiding::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        return [
            'total' => LuaranProsiding::count(),
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
