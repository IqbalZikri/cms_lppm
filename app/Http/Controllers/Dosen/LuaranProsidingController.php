<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
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
        $dosen = Dosen::where('user_id', auth()->user()->id)->with('penulis', 'fakultas')->first();
        $data = LuaranProsiding::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10);
        return Inertia::render('dosen/luaran-prosiding/index', [
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('dosen/luaran-prosiding/create', [
            'fakultas' => $fakultas,
            'role' => auth()->user()->role
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

            return redirect()->route('dosen.luaran_prosiding.index')->with('success', 'Berhasil menambahkan luaran prosiding');
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
        return Inertia::render('dosen/luaran-prosiding/show', [
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
        return Inertia::render('dosen/luaran-prosiding/edit', [
            'data' => $luaranProsiding,
            'fakultas' => $fakultas,
            'role' => auth()->user()->role
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

            return redirect()->route('dosen.luaran_prosiding.index')->with('success', 'Berhasil mengedit luaran prosiding');
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
