<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class ProdiController extends Controller
{
    public function index()
    {
        $data = Prodi::paginate(10);
        $fakultas = Fakultas::get();

        return Inertia::render('admin/prodi/index', [
            'data' => $data,
            'fakultas' => $fakultas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fakultas_id' => 'required',
            'kode_prodi' => 'required|unique:prodis,kode_prodi',
            'nama_prodi' => 'required',
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'kode_prodi.required' => 'Kode prodi wajib diisi',
            'kode_prodi.unique' => 'Kode prodi sudah digunakan',
            'nama_prodi.required' => 'Nama prodi wajib diisi',
        ]);

        try {
            Prodi::create([
                'fakultas_id' => $request->fakultas_id,
                'kode_prodi' => $request->kode_prodi,
                'nama_prodi' => $request->nama_prodi,
            ]);

            return back()->with('success', 'Berhasil menambahkan prodi baru');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'fakultas_id' => 'required',
            'kode_prodi' => 'required|unique:prodis,kode_prodi,'.$id,
            'nama_prodi' => 'required',
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'kode_prodi.required' => 'Kode prodi wajib diisi',
            'kode_prodi.unique' => 'Kode prodi sudah digunakan',
            'nama_prodi.required' => 'Nama prodi wajib diisi',
        ]);

        $data = Prodi::findOrFail($id);

        try {
            $data->update([
                'fakultas_id' => $request->fakultas_id,
                'kode_prodi' => $request->kode_prodi,
                'nama_prodi' => $request->nama_prodi,
            ]);

            return back()->with('success', 'Berhasil mengedit prodi');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function destroy($id)
    {
        $data = Prodi::findOrFail($id);
        try {
            $data->delete();

            return back()->with('success', 'Berhasil menghapus prodi');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function getProdi($id)
    {
        $prodi = Prodi::where('fakultas_id', $id)->get();

        return response()->json($prodi);
    }
}
