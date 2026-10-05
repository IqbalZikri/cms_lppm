<?php

namespace App\Http\Controllers\Admin;

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
    public function index(Request $request)
    {
        $queryLuaranProsiding = LuaranProsiding::query()->with("penulis.fakultas", "penulis.dosen");
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('admin/luaran-prosiding/create', [
            'fakultas' => $fakultas
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
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
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
                $data->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i++,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.luaran_prosiding.index')->with('success', 'Berhasil menambahkan luaran prosiding');
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
        $luaranProsiding->load('penulis.fakultas', 'penulis.dosen');
        return Inertia::render('admin/luaran-prosiding/show', [
            'data' => $luaranProsiding
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranProsiding $luaranProsiding)
    {
        $luaranProsiding->load('penulis');
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('admin/luaran-prosiding/edit', [
            'data' => $luaranProsiding,
            'fakultas' => $fakultas
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
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
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
            foreach ($validated['authors'] as $i => $author) {
                $luaranProsiding->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.luaran_prosiding.index')->with('success', 'Berhasil mengedit luaran prosiding');
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
            $luaranProsiding->delete();
            return back()->with('success', 'Berhasil menghapus luaran prosiding');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
