<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiController extends Controller
{
    protected $prodi = Prodi;

    protected $validate = [
        'fakultas_id' => 'required',
        'kode_prodi' => 'required|unique:prodi,kode_prodi',
        'nama_prodi' => 'required'
    ];

    public function index()
    {
        $data = Prodi::paginate(10);

        return Inertia::render('prodi/index', [
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        dd($this->prodi);
        $request->validate([
            'fakultas_id' => 'required',
            'kode_prodi' => 'required|unique:prodi,kode_prodi',
            'nama_prodi' => 'required'
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'kode_prodi.required' => 'Kode prodi wajib diisi',
            'kode_prodi.unique' => 'Kode prodi sudah digunakan',
            'nama_prodi.required' => 'Nama prodi wajib diisi'
        ]);

        // try {
        //     Prodi::create([
        //         'fakultas_id',
        //         'kode_prodi',
        //         'nama_prodi'
        //     ])
        // } catch (\Throwable $th) {
        //     //throw $th;
        // }
    }
}
