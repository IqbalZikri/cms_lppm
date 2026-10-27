<?php

namespace App\Http\Controllers;

use App\Actions\SyncAuthors;
use App\Http\Requests\PkmRequest;
use App\Imports\PkmImport;
use App\Imports\PkmPreviewImport;
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
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

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
        $role = auth()->user()->role;

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
            'role' => $role
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
            'data' => $pkm,
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

        $role = auth()->user()->role;

        return Inertia::render('pkm/show', [
            'data' => $pkm->load($this->authorRelations(withTrashed: true)),
            'backUrl' => $backUrl,
            'role' => $role,
        ]);
    }

    public function edit(Pkm $pkm)
    {
        $this->authorize('update', $pkm);

        return Inertia::render('pkm/edit', [
            'data' => $pkm->load('penulis', 'penulisLuar'),
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

        return to_route('pkm.index')->with('success', 'Berhasil menambahkan pkm');
    }

    public function update(PkmRequest $request, Pkm $pkm, SyncAuthors $syncAuthors)
    {
        DB::transaction(function () use ($request, $pkm, $syncAuthors) {
            $pkm->update($request->safe()->except('authors'));
            $syncAuthors->handle($pkm, $request->validated('authors'));
        });

        return to_route('pkm.index')->with('success', 'Berhasil memperbarui pkm');
    }

    public function destroy(Pkm $pkm)
    {
        $this->authorize('delete', $pkm);

        DB::transaction(function () use ($pkm) {
            $pkm->penulis()->delete();
            $pkm->penulisLuar()->delete();
            $pkm->delete();
        });

        return back()->with('success', 'Berhasil menghapus pkm');
    }

    public function restore(Pkm $pkm)
    {
        $this->authorize('restore', $pkm);

        DB::transaction(function () use ($pkm) {
            $pkm->penulis()->restore();
            $pkm->penulisLuar()->restore();
            $pkm->restore();
        });

        return back()->with('success', 'Berhasil memulihkan pkm');
    }

    public function forceDelete(Pkm $pkm)
    {
        $this->authorize('forceDelete', $pkm);

        DB::transaction(function () use ($pkm) {
            $pkm->penulis()->forceDelete();
            $pkm->penulisLuar()->forceDelete();
            $pkm->forceDelete();
        });

        return back()->with('success', 'Berhasil menghapus permanen pkm');
    }

    public function pageImport()
    {
        return Inertia::render('pkm/import');
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ]);


        $import = new PkmPreviewImport();
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

        $import = new PkmImport();

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
            ->route('pkm.index')
            ->with('success', $jumlahDilewati > 0
                ? "Import selesai. {$jumlahDilewati} baris dilewati karena data tidak valid."
                : 'Data kegiatan berhasil diimport')
            ->with('import_skipped', $dilewati);
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
