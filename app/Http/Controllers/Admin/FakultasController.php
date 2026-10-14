<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FakultasController extends Controller
{
    public function index(Request $request)
    {
        $fakultas = Fakultas::query()->search($request->query('search'))->paginate(10)->withQueryString();

        return Inertia::render('admin/fakultas/index', [
            'data' => $fakultas,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_fakultas' => 'required',
        ], [
            'nama_fakultas.required' => 'Nama fakultas wajib diisi',
        ]);

        try {
            $data = Fakultas::create([
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
            'nama_fakultas' => 'required',
        ], [
            'nama_fakultas.required' => 'Nama fakultas wajib diisi',
        ]);

        $data = Fakultas::findOrFail($id);

        try {
            $data->update([
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
