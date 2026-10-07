<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use App\Models\Penulis;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class HkiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexAdmin(Request $request)
    {
        $queryHki = Hki::query()->with('penulis.fakultas', 'penulis.dosen','penulisLuar');
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
        $dosen = Dosen::where('user_id', auth()->user()->id)->first();
        $data = Hki::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
        return Inertia::render('dosen/hki/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function indexUppm(Request $request)
    {
        $data = Hki::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
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
        $role = auth()->user()->role;
        return Inertia::render('hki/create', [
            'fakultas' => $fakultas,
            'role' => $role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_hki' => ['required', Rule::in(['paten', 'haki'])],
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'nomer_paten' => 'required_if:jenis_hki,paten',
            'nomer_pengajuan_haki' => 'required_if:jenis_hki,haki',
            'jumlah_dana' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'jenis_hki.required' => 'Silahkan pilih salah satu jenis HKI',
            'jenis_hki.in' => 'Jenis HKI tidak valid',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'nomer_pengajuan_haki.required_if' => 'Silahkan isi nomer pengajuan haki',
            'nomer_paten.required_if' => 'Silahkan isi nomer paten',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {

            $hki = Hki::create([
                'jenis_hki' => $validated['jenis_hki'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'nomer_pengajuan_haki' => $validated['nomer_pengajuan_haki'] ?? null,
                'nomer_paten' => $validated['nomer_paten'] ?? null,
                'sumber_dana' => $validated['sumber_dana'] ?? null,
                'jumlah_dana' => $validated['jumlah_dana'] ?? null,
            ]);

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $hki->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $hki->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.hki.index')->with('success', 'Berhasil menambahkan HKI');
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
        return Inertia::render('hki/show', [
            'data' => $hki,
            "role" => auth()->user()->role
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hki $hki)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $hki->load('penulis', 'penulisLuar');
        $role = auth()->user()->role;
        return Inertia::render('hki/edit', [
            'data' => $hki,
            'fakultas' => $fakultas,
            'role' => $role,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hki $hki)
    {
        $validated = $request->validate([
            'jenis_hki' => ['required', Rule::in(['paten', 'haki'])],
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'nomer_paten' => 'required_if:jenis_hki,paten',
            'nomer_pengajuan_haki' => 'required_if:jenis_hki,haki',
            'jumlah_dana' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'jenis_hki.required' => 'Silahkan pilih salah satu jenis HKI',
            'jenis_hki.in' => 'Jenis HKI tidak valid',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'nomer_pengajuan_haki.required_if' => 'Silahkan isi nomer pengajuan haki',
            'nomer_paten.required_if' => 'Silahkan isi nomer paten',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {

            $hki->update([
                'jenis_hki' => $validated['jenis_hki'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'nomer_pengajuan_haki' => $validated['nomer_pengajuan_haki'] ?? null,
                'nomer_paten' => $validated['nomer_paten'] ?? null,
                'sumber_dana' => $validated['sumber_dana'] ?? null,
                'jumlah_dana' => $validated['jumlah_dana'] ?? null,
            ]);

            $hki->penulis()->delete();
            $hki->penulisLuar()->delete();

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $hki->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $hki->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.hki.index')->with('success', 'Berhasil mengedit HKI');
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
