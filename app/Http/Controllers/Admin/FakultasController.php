<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FakultasController extends Controller
{
    public function index()
    {
        $fakultas = Fakultas::paginate(10);

        return Inertia::render('admin/fakultas/index', [
            'data' => $fakultas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_fakultas' => 'required|unique:fakultas,kode_fakultas',
            'nama_fakultas' => 'required',
        ], [
            'kode_fakultas.required' => 'Kode fakultas wajib diisi',
            'kode_fakultas.unique' => 'Kode fakultas ini sudah digunakan, silahkan cek kembali',
            'nama_fakultas.required' => 'Nama fakultas wajib diisi',
        ]);

        try {
            $data = Fakultas::create([
                'kode_fakultas' => $request->kode_fakultas,
                'nama_fakultas' => $request->nama_fakultas,
            ]);

            return back()->with('success', 'Berhasil menambahkan fakultas baru');
        } catch (\Throwable $th) {
            Log::info(($th->getMessage()));

            return back()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kode_fakultas' => 'required',
            'nama_fakultas' => 'required',
        ], [
            'kode_fakultas.required' => 'Kode fakultas wajib diisi',
            'nama_fakultas.required' => 'Nama fakultas wajib diisi',
        ]);

        $data = Fakultas::findOrFail($id);

        try {
            $data->update([
                'kode_fakultas' => $request->kode_fakultas,
                'nama_fakultas' => $request->nama_fakultas,
            ]);

            return back()->with('success', 'Berhasil mengedit fakultas');
        } catch (\Throwable $th) {
            return back()->with('error', 'Terjadi kesalahan');
        }
    }

    public function destroy($id)
    {
        $data = Fakultas::findOrFail($id);

        try {
            $data->delete();

            return back()->with('success', 'Berhasil menghapus fakultas');
        } catch (\Throwable $th) {
            return back()->with('error', 'Terjadi kesalahan');
        }

    }
}
