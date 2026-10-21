<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Requests\LuaranJurnalRequest;
use App\Imports\JurnalImport;
use App\Imports\JurnalPreviewImport;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranJurnal;
use App\Models\Penulis;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

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

        $role = auth()->user()->role;

        return Inertia::render('luaran-jurnal/index', [
            'data' => $luaranJurnal,
            'filters' => $filters,
            'fakultas' => $fakultas,
            'stats' => $user->role === 'admin' ? $this->stats($fakultas) : null,
            'role' => $role
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

        $role = auth()->user()->role;

        return Inertia::render('luaran-jurnal/show', [
            'data' => $luaranJurnal->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl,
            'role' => $role
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

        return to_route('luaran_jurnal.index')->with('success', 'Berhasil menambahkan luaran jurnal');
    }

    public function update(LuaranJurnalRequest $request, LuaranJurnal $luaranJurnal, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $luaranJurnal, $syncAuthors) {
            $luaranJurnal->update($request->safe()->except('authors'));
            $syncAuthors->handle($luaranJurnal, $request->validated('authors'));
        });

        return to_route('luaran_jurnal.index')->with('success', 'Berhasil memperbarui luaran jurnal');
    }

    public function destroy(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('delete', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->delete();
            $luaranJurnal->penulisLuar()->delete();
            $luaranJurnal->delete();
        });

        return back()->with('success', 'Berhasil menghapus luaran jurnal');
    }

    public function restore(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('restore', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->restore();
            $luaranJurnal->penulisLuar()->restore();
            $luaranJurnal->restore();
        });

        return back()->with('success', 'Berhasil memulihkan luaran jurnal');
    }

    public function pageImport()
    {
        return Inertia::render('luaran-jurnal/import');
    }

    public function forceDelete(LuaranJurnal $luaranJurnal)
    {
        $this->authorize('forceDelete', $luaranJurnal);

        DB::transaction(function () use ($luaranJurnal) {
            $luaranJurnal->penulis()->forceDelete();
            $luaranJurnal->penulisLuar()->forceDelete();
            $luaranJurnal->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen luaran jurnal');
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ]);


        $import = new JurnalPreviewImport();
        Excel::import($import, $request->file('file'));

        $rows = collect($import->rows);

        return response()->json([
            'total' => $rows->count(),
            'invalid' => $rows->filter(fn($r) => count($r['errors']) > 0)->count(),
            'valid' => $rows->filter(fn($r) => count($r['errors']) === 0)->count(),
            'rows' => $rows->take(500)->values(), // batasi agar respons tidak terlalu besar
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ], [
            'file.required' => 'Pilih file Excel terlebih dahulu',
            'file.mimes' => 'File harus berformat xlsx, xls, atau csv',
            'file.max' => 'Ukuran file maksimal 5 MB',
        ]);

        $import = new JurnalImport();

        try {
            Excel::import($import, $request->file('file'));
        } catch (Throwable $e) {
            report($e);

            return back()->withErrors(['file' => 'Import gagal, silakan periksa file dan coba lagi.']);
        }

        // Satu baris bisa gagal di beberapa kolom, jadi dikelompokkan per baris
        $dilewati = $import->failures()
            ->groupBy(fn($f) => $f->row())
            ->map(fn($items, $row) => "Baris {$row}: " . $items->flatMap->errors()->implode(', '))
            ->values()
            ->take(50)
            ->all();

        $jumlahDilewati = $import->failures()->groupBy(fn($f) => $f->row())->count();

        return redirect()
            ->route('luaran_jurnal.index')
            ->with('success', $jumlahDilewati > 0
                ? "Import selesai. {$jumlahDilewati} baris dilewati karena data tidak valid."
                : 'Data jurnal berhasil diimport')
            ->with('import_skipped', $dilewati);
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
