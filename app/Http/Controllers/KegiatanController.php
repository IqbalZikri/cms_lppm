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
        return Inertia::render('admin/kegiatan/create', [
            'fakultas' => $fakultas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul_kegiatan' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => 'required',
            'jumlah_dana' => 'required|numeric',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'judul_kegiatan.required' => 'Silahkan isi judul kegiatan',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
        ]);

        DB::beginTransaction();

        try {
            // Ambil nama dosen dari DB berdasarkan dosen_id yang tervalidasi
            // (lebih aman daripada percaya nama_dosen dari client)
            $dosenIds = collect($validated['authors'])->pluck('dosen_id');
            $dosenMap = Dosen::whereIn('id', $dosenIds)->pluck('nama_dosen', 'id');

            $fakultasIds = collect($validated['authors'])->pluck('fakultas_id');
            $fakultasMap = Fakultas::whereIn('id', $fakultasIds)->pluck('nama_fakultas', 'id');

            $penulisJson = collect($validated['authors'])->map(function ($author) use ($dosenMap, $fakultasMap) {
                return [
                    'fakultas_id' => (int) $author['fakultas_id'],
                    'nama_fakultas' => $fakultasMap[$author['fakultas_id']] ?? null,
                    'dosen_id' => (int) $author['dosen_id'],
                    'nama_dosen' => $dosenMap[$author['dosen_id']] ?? null,
                ];
            })->values()->all();

            Kegiatan::create([
                'judul_kegiatan' => $validated['judul_kegiatan'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
                'penulis' => $penulisJson, // otomatis di-encode ke JSON karena cast 'array'
            ]);

            DB::commit();

            return redirect()->route('admin.kegiatan.index')->with('success', 'Berhasil menambahkan penelitian kegiatan');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        $fakultas = Fakultas::get();
        return Inertia::render('admin/kegiatan/show', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('admin/kegiatan/edit', [
            'kegiatan' => $kegiatan,
            'fakultas' => $fakultas,
            'dosen' => $dosen
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        $validated = $request->validate([
            'judul_kegiatan' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'jumlah_dana' => 'required|numeric',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'judul_kegiatan.required' => 'Silahkan isi judul kegiatan',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
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

            $kegiatan->update([
                'judul_kegiatan' => $validated['judul_kegiatan'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
                'penulis' => $penulisJson,
            ]);

            DB::commit();

            return redirect()->route('admin.kegiatan.index')->with('success', 'Berhasil memperbarui kegiatan penelitian');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
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
