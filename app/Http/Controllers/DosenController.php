<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Dosen::paginate(10);
        $fakultas = Fakultas::with('dosen')->get();

        return Inertia::render('admin/dosen/index', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('admin/dosen/create', [
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fakultas_id' => 'required',
            'prodi_id' => 'required',
            'nidn' => 'required',
            'nama_dosen' => 'required',
            'jenis_kelamin' => 'required',
            'tanggal_lahir' => 'required',
            'tempat_lahir' => 'required',
            'alamat' => 'required',
            'hp' => 'required',
            'email' => 'required|unique:users,email',
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'nidn.required' => 'NIDN wajib diisi',
            'nama_dosen.required' => 'Nama dosen wajib diisi',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi',
            'alamat.required' => 'Alamat wajib diisi',
            'hp.required' => 'No. Hp wajib diisi',
            'email.required' => 'Email wajib diisi',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->nama_dosen,
                'email' => $request->email,
                'password' => $request->nidn
            ]);

            Dosen::create([
                'fakultas_id' => $request->fakultas_id,
                'nidn' => $request->nidn,
                'nuptk' => $request->nuptk,
                'nama_dosen' => $request->nama_dosen,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tanggal_lahir' => $request->tanggal_lahir,
                'tempat_lahir' => $request->tempat_lahir,
                'alamat' => $request->alamat,
                'hp' => $request->hp,
                'email' => $request->email,
                'user_id' => $user->id,
            ]);

            DB::commit();
            return redirect()->route('admin.dosen.index')->with('success', 'Berhasil menambahkan data dosen baru');
        } catch (\Throwable $th) {
            DB::rollback();
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Dosen::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Dosen::findOrFail($id);
        try {
            $data->delete();
            return back()->with('success', 'Berhasil menghapus data dosen');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
