<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use App\Models\LuaranJurnal;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranJurnalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = LuaranJurnal::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
        return Inertia::render('uppm/luaran-jurnal/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('uppm/luaran-jurnal/create', [
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
            'jenis_luaran_jurnal' => "required",
            'judul' => "required",
            'abstrak' => "required",
            'semester' => "required",
            'tahun' => "required",
            'link_berkas' => "required",
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id|distinct',
            'authors.*.nama_fakultas' => 'required',
            'authors.*.nama_dosen' => 'required',
        ], [
            "jenis_luaran_jurnal.required" => "Silahkan isi luaran jurnal",
            "judul.required" => "Silahkan isi judul",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
            'authors.*.dosen_id.distinct' => 'Duplikat nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranJurnal = LuaranJurnal::create([
                'jenis_luaran_jurnal' => $validated['jenis_luaran_jurnal'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                $luaranJurnal->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('uppm.luaran_jurnal.index')->with('success', 'Berhasil menambahkan luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LuaranJurnal $luaranJurnal)
    {
        $luaranJurnal->load('penulis.fakultas', 'penulis.dosen');
        return Inertia::render('uppm/luaran-jurnal/show', [
            'data' => $luaranJurnal
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranJurnal $luaranJurnal)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $luaranJurnal->load('penulis');
        return Inertia::render('uppm/luaran-jurnal/edit', [
            'fakultas' => $fakultas,
            'data' => $luaranJurnal,
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LuaranJurnal $luaranJurnal)
    {
        $validated = $request->validate([
            'jenis_luaran_jurnal' => "required",
            'judul' => "required",
            'abstrak' => "required",
            'semester' => "required",
            'tahun' => "required",
            'link_berkas' => "required",
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id|distinct',
            'authors.*.nama_fakultas' => 'required',
            'authors.*.nama_dosen' => 'required',
        ], [
            "jenis_luaran_jurnal.required" => "Silahkan isi luaran jurnal",
            "judul.required" => "Silahkan isi judul",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
            'authors.*.dosen_id.distinct' => 'Duplikat nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranJurnal->update([
                'jenis_luaran_jurnal' => $validated['jenis_luaran_jurnal'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            $luaranJurnal->penulis()->delete();
            foreach ($validated['authors'] as $i => $author) {
                $luaranJurnal->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('uppm.luaran_jurnal.index')->with('success', 'Berhasil mengedit luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LuaranJurnal $luaranJurnal)
    {
        try {
            $luaranJurnal->penulis()->delete();
            $luaranJurnal->delete();
            return back()->with('success', 'Berhasil menghapus data luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
