<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Pkm;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class PkmController extends Controller
{
    public function index()
    {
        $data = Pkm::latest()->paginate(10);
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/index', [
            'data' => $data,
            'fakultas' => $fakultas,
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/create', [
            'fakultas' => $fakultas
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'jenis_pkm' => ['required', Rule::in(['pelaksanaan', 'jurnal'])],
            'judul' => 'required',
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
            'jenis_pkm.required' => 'Silahkan pilih jenis pkm',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
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

            Pkm::create([
                'jenis_pkm' => $validated['jenis_pkm'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
                'penulis' => $penulisJson,
            ]);

            DB::commit();

            return redirect()->route('admin.pkm.index')->with('success', 'Berhasil menambahkan pkm');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function show($id)
    {
        $data = Pkm::findOrFail($id);
        return Inertia::render('admin/pkm/show', [
            'data' => $data
        ]);
    }

    public function edit($id)
    {
        $data = Pkm::findOrFail($id);
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/edit', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'jenis_pkm' => ['required', Rule::in(['pelaksanaan', 'jurnal'])],
            'judul' => 'required',
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
            'jenis_pkm.required' => 'Silahkan pilih jenis pkm',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
        ]);

        DB::beginTransaction();

        try {
            $pkm = Pkm::findOrFail($id);
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

            $pkm->update([
                'jenis_pkm' => $validated['jenis_pkm'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
                'penulis' => $penulisJson,
            ]);

            DB::commit();

            return redirect()->route('admin.pkm.index')->with('success', 'Berhasil memperbarui pkm');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function destroy($id)
    {
        $data = Pkm::findOrFail($id);

        try {
            $data->delete();
            return back()->with('success', 'Berhasil menghapus pkm');
        } catch (\Throwable $th) {
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
