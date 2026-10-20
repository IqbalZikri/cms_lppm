<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Requests\LuaranBukuRequest;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranBuku;
use App\Models\Penulis;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranBukuController extends Controller
{
    use AuthorizesRequests;
    private const PER_PAGE = 10;

    public function index(Request $request)
    {
        $this->authorize('viewAny', LuaranBuku::class);

        $user = $request->user();
        $filters = $request->only('search', 'cari_fakultas');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $luaranBuku = LuaranBuku::visibleTo($user)
            ->with($this->authorRelations())
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        $role = auth()->user()->role;

        return Inertia::render('luaran-buku/index', [
            'data' => $luaranBuku,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
            'role' => $role
        ]);
    }

    public function dihapus(Request $request)
    {
        $this->authorize('viewTrashed', LuaranBuku::class);

        $filters = $request->only('search', 'cari_fakultas');

        $luaranBuku = LuaranBuku::onlyTrashed()
            ->visibleTo($request->user())
            ->with($this->authorRelations(withTrashed: true))
            ->filter($filters)
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('luaran-buku/dihapus', [
            'data' => $luaranBuku,
            'filters' => $filters,
            'fakultas' => Fakultas::select('id', 'nama_fakultas')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', LuaranBuku::class);

        return Inertia::render('luaran-buku/create', [
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function show(LuaranBuku $luaranBuku, Request $request)
    {
        $this->authorize('view', $luaranBuku);

        $backUrl = $request->query('from') === 'dihapus'
            ? route('luaran_buku.dihapus')
            : route('luaran_buku.index');

        return Inertia::render('luaran-buku/show', [
            'data' => $luaranBuku->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl
        ]);
    }

    public function edit(LuaranBuku $luaranBuku)
    {
        $this->authorize('update', $luaranBuku);

        return Inertia::render('luaran-buku/edit', [
            'data' => $luaranBuku->load('penulis', 'penulisLuar'),
            'fakultas' => Fakultas::get(),
        ]);
    }

    public function store(LuaranBukuRequest $request, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $syncAuthors) {
            $luaranBuku = LuaranBuku::create([
                ...$request->safe()->except('authors'),
                'user_id' => $request->user()->id,
            ]);

            $syncAuthors->handle($luaranBuku, $request->validated('authors'));
        });

        return to_route('luaran_buku.index')->with('success', 'Berhasil menambahkan luaran buku');
    }

    public function update(LuaranBukuRequest $request, LuaranBuku $luaranBuku, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $luaranBuku, $syncAuthors) {
            $luaranBuku->update($request->safe()->except('authors'));
            $syncAuthors->handle($luaranBuku, $request->validated('authors'));
        });

        return to_route('luaran_buku.index')->with('success', 'Berhasil memperbarui luaran buku');
    }

    public function destroy(LuaranBuku $luaranBuku)
    {
        $this->authorize('delete', $luaranBuku);

        DB::transaction(function () use ($luaranBuku) {
            $luaranBuku->penulis()->delete();
            $luaranBuku->penulisLuar()->delete();
            $luaranBuku->delete();
        });

        return back()->with('success', 'Berhasil menghapus luaran buku');
    }

    public function restore(LuaranBuku $luaranBuku)
    {
        $this->authorize('restore', $luaranBuku);

        DB::transaction(function () use ($luaranBuku) {
            $luaranBuku->penulis()->restore();
            $luaranBuku->penulisLuar()->restore();
            $luaranBuku->restore();
        });

        return back()->with('success', 'Berhasil memulihkan luaran buku');
    }

    public function forceDelete(LuaranBuku $luaranBuku)
    {
        $this->authorize('forceDelete', $luaranBuku);

        DB::transaction(function () use ($luaranBuku) {
            $luaranBuku->penulis()->forceDelete();
            $luaranBuku->penulisLuar()->forceDelete();
            $luaranBuku->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen luaran buku');
    }

    /**
     * Statistik LuaranBuku (khusus admin).
     */
    private function stats(Collection $fakultas): array
    {
        $counts = Penulis::where('penulisable_type', LuaranBuku::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        return [
            'total' => LuaranBuku::count(),
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
