<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranProsiding;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranProsidingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = LuaranProsiding::latest()->paginate(10);
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('admin/luaran-prosiding/index', [
            'data' => $data,
            'fakultas' => $fakultas
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
            $dosenIds = collect($validated['authors'])->pluck('dosen_id');
            $dosenMap = Dosen::whereIn('id', $dosenIds)->pluck('nama_dosen', 'id');

            $fakultasIds = collect($validated['authors'])->pluck('fakultas_id');
            $fakultasMap = Fakultas::whereIn('id', $fakultasIds)->pluck('nama_fakultas', 'id');

            $penulisJson = collect($validated['authors'])->map(function ($author) use ($dosenMap, $fakultasMap) {
                return [
                    'fakultas_id' => (int) $author['fakultas_id'],
                    'dosen_id' => (int) $author['dosen_id'],
                    'nama_fakultas' => $fakultasMap[$author['fakultas_id']] ?? null,
                    'nama_dosen' => $dosenMap[$author['dosen_id']] ?? null,
                ];
            })->values()->all();

            LuaranProsiding::create([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'penulis' => $penulisJson,
            ]);

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
        return Inertia::render('admin/luaran-prosiding/show', [
            'luaranProsiding' => $luaranProsiding
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranProsiding $luaranProsiding)
    {
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
            $dosenIds = collect($validated['authors'])->pluck('dosen_id');
            $dosenMap = Dosen::whereIn('id', $dosenIds)->pluck('nama_dosen', 'id');

            $fakultasIds = collect($validated['authors'])->pluck('fakultas_id');
            $fakultasMap = Fakultas::whereIn('id', $fakultasIds)->pluck('nama_fakultas', 'id');

            $penulisJson = collect($validated['authors'])->map(function ($author) use ($dosenMap, $fakultasMap) {
                return [
                    'fakultas_id' => (int) $author['fakultas_id'],
                    'dosen_id' => (int) $author['dosen_id'],
                    'nama_fakultas' => $fakultasMap[$author['fakultas_id']] ?? null,
                    'nama_dosen' => $dosenMap[$author['dosen_id']] ?? null,
                ];
            })->values()->all();

            $luaranProsiding->update([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'penulis' => $penulisJson,
            ]);

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
