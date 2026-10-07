<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranProsiding;
use App\Models\Penulis;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranProsidingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexAdmin(Request $request)
    {
        $queryLuaranProsiding = LuaranProsiding::query()->with("penulis.fakultas", "penulis.dosen", "penulisLuar");
        if ($request->filled('cari_fakultas')) {
            $queryLuaranProsiding->whereHas('penulis', function ($q) use ($request) {
                $q->where('fakultas_id', $request->cari_fakultas);
            });
        }
        $data = $queryLuaranProsiding->clone()->search($request->query("search"))->latest()->paginate(10)->withQueryString();
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();

        $totalLuaranProsiding = LuaranProsiding::count();
        $counts = Penulis::where('penulisable_type', LuaranProsiding::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        $totalLuaranProsidingPerFakultas = $fakultas->map(fn($f) => [
            'label' => $f->nama_fakultas,
            'count' => $counts[$f->id] ?? 0,
        ])->values();

        return Inertia::render('admin/luaran-prosiding/index', [
            'data' => $data,
            "fakultas" => $fakultas,
            "filters" => $request->only("search", "cari_fakultas"),
            "totalLuaranProsidingPerFakultas" => $totalLuaranProsidingPerFakultas,
            "totalLuaranProsiding" => $totalLuaranProsiding,
        ]);
    }

    public function indexDosen(Request $request)
    {
        $dosen = Dosen::where('user_id', auth()->user()->id)->with('penulis', 'fakultas')->first();
        $data = LuaranProsiding::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10);
        return Inertia::render('dosen/luaran-prosiding/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function indexUppm(Request $request)
    {
        $data = LuaranProsiding::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
        return Inertia::render('uppm/luaran-prosiding/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $role = auth()->user()->role;
        return Inertia::render('luaran-prosiding/create', [
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
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $data = LuaranProsiding::create([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $data->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $data->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.luaran_prosiding.index')->with('success', 'Berhasil menambahkan luaran prosiding');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LuaranProsiding $luaranProsiding)
    {
        $luaranProsiding->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        $role = auth()->user()->role;
        return Inertia::render('luaran-prosiding/show', [
            'data' => $luaranProsiding,
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranProsiding $luaranProsiding)
    {
        $luaranProsiding->load('penulis', 'penulisLuar');
        $role = auth()->user()->role;
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('luaran-prosiding/edit', [
            'data' => $luaranProsiding,
            'fakultas' => $fakultas,
            'role' => $role,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LuaranProsiding $luaranProsiding)
    {
        $validated = $request->validate([
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranProsiding->update([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            $luaranProsiding->penulis()->delete();
            $luaranProsiding->penulisLuar()->delete();
            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $luaranProsiding->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $luaranProsiding->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.luaran_prosiding.index')->with('success', 'Berhasil mengedit luaran prosiding');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LuaranProsiding $luaranProsiding)
    {
        try {
            $luaranProsiding->penulis()->delete();
            $luaranProsiding->penulisLuar()->delete();
            $luaranProsiding->delete();
            return back()->with('success', 'Berhasil menghapus luaran prosiding');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
