<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Kegiatan;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Kegiatan::latest()->paginate(10);
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('admin/kegiatan/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            'dosen' => $dosen
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('admin/kegiatan/create', [
            'fakultas' => $fakultas,
            'dosen' => $dosen
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'dosen_id' => [
                'required',
                Rule::exists('dosens', 'id')->where('fakultas_id', $request->fakultas_id),
            ],
            'judul_kegiatan' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => "required|enum:internal,eksternal",
            'jumlah_dana' => "required|numeric",
            'penulis' => "required",
        ], [
            "fakultas_id.required" => "Silahkan pilih salah satu fakultas",
            "fakultas_id.exists" => "Data fakultas tidak ada",
            "dosen_id.required" => "Silahkan pilih salah satu dosen",
            "dosen_id.exists" => "Data dosen tidak sesuai dengan fakultas",
            "judul_kegiatan.required" => "Silahkan isi judul kegiatan",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            "sumber_dana.required" => "Silahkan isi sumber dana",
            "jumlah_dana.required" => "Silahkan isi jumlah dana",
            "penulis.required" => "Silahkan isi penulis"
        ]);

        DB::beginTransaction();

        try {
            Kegiatan::create($validated);

            return redirect()->route('admin.kegiatan.index')->with('success', 'Berhasil menambahkan penelitian kegiatan');
        } catch (\Throwable $th) {
            Log::info($th->getMessage(), $th->getTrace());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        return Inertia::render('admin/kegiatan/show', [
            'data' => $data
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('admin/kegiatan/edit', [
            'data' => $data,
            'fakultas' => $fakultas,
            'dosen' => $dosen
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'dosen_id' => [
                'required',
                Rule::exists('dosens', 'id')->where('fakultas_id', $request->fakultas_id),
            ],
            'judul_kegiatan' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => "required|enum:internal,eksternal",
            'jumlah_dana' => "required|numeric",
            'penulis' => "required",
        ], [
            "fakultas_id.required" => "Silahkan pilih salah satu fakultas",
            "fakultas_id.exists" => "Data fakultas tidak ada",
            "dosen_id.required" => "Silahkan pilih salah satu dosen",
            "dosen_id.exists" => "Data dosen tidak sesuai dengan fakultas",
            "judul_kegiatan.required" => "Silahkan isi judul kegiatan",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            "sumber_dana.required" => "Silahkan isi sumber dana",
            "jumlah_dana.required" => "Silahkan isi jumlah dana",
            "penulis.required" => "Silahkan isi penulis"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        try {
            $data->delete();
            return back()->with('success', 'Berhasil menghapus kegiatan penelitian');
        } catch (\Throwable $th) {
            Log::info($th->getMessage(), $th->getTrace());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
