<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Requests\LuaranJurnalRequest;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranJurnal;
use App\Models\Penulis;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranJurnalController extends Controller
{
    use AuthorizesRequests;
    private const PER_PAGE = 10;

    public function index(Request $request)
    {
        $this->authorize('viewAny', LuaranJurnal::class);

        $user = $request->user();
        $filters = $request->only('search', 'cari_fakultas');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $luaranJurnal = LuaranJurnal::visibleTo($user)
            ->with($this->authorRelations())
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('luaran-jurnal/index', [
            'data' => $luaranJurnal,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewTrashed', LuaranJurnal::class);

        $filters = $request->only('search', 'cari_fakultas');

        $luaranJurnal = LuaranJurnal::onlyTrashed()
            ->visibleTo($request->user())
            ->with($this->authorRelations(withTrashed: true))
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('luaran-jurnal/dihapus', [
            'data' => $luaranJurnal,
            'filters' => $filters,
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', LuaranJurnal::class);

        return Inertia::render('luaran-jurnal/create', [
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function show(LuaranJurnal $luaranJurnal, Request $request)
    {
        $this->authorize('view', $luaranJurnal);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('luaran_jurnal.dihapus')
            : route('luaran_jurnal.index');

        return Inertia::render('luaran-jurnal/show', [
            'data' => $luaranJurnal->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl
        ]);
    }

    public function edit(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('update', $luaranJurnal);

        return Inertia::render('luaran-jurnal/edit', [
            'data' => $luaranJurnal->load('penulis', 'penulisLuar'),
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function store(LuaranJurnalRequest $request, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $syncAuthors) {
            $luaranJurnal = LuaranJurnal::create([
                ...$request->safe()->except('authors'),
                'user_id' => $request->user()->id,
            ]);

            $syncAuthors->handle($luaranJurnal, $request->validated('authors'));
        });

        return to_route('luaran_jurnal.index')->with('success', 'Berhasil menambahkan LuaranJurnal');
    }

    public function update(LuaranJurnalRequest $request, LuaranJurnal $luaranJurnal, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $luaranJurnal, $syncAuthors) {
            $luaranJurnal->update($request->safe()->except('authors'));
            $syncAuthors->handle($luaranJurnal, $request->validated('authors'));
        });

        return to_route('luaran_jurnal.index')->with('success', 'Berhasil memperbarui LuaranJurnal');
    }

    public function destroy(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('delete', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->delete();
            $luaranJurnal->penulisLuar()->delete();
            $luaranJurnal->delete();
        });

        return back()->with('success', 'Berhasil menghapus LuaranJurnal');
    }

    public function restore(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('restore', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->restore();
            $luaranJurnal->penulisLuar()->restore();
            $luaranJurnal->restore();
        });

        return back()->with('success', 'Berhasil memulihkan LuaranJurnal');
    }

    public function forceDelete(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('forceDelete', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->forceDelete();
            $luaranJurnal->penulisLuar()->forceDelete();
            $luaranJurnal->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen LuaranJurnal');
    }

    /**
     * Statistik LuaranJurnal (khusus admin).
     */
    private function stats(Collection $fakultas): array
    {
        $counts = Penulis::where('penulisable_type', LuaranJurnal::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        return [
            'total' => LuaranJurnal::count(),
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
