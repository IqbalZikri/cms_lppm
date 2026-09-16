<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
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

        return Inertia::render('dosen/index', [
            'data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dosen/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_dosen' => 'required',
            'jenis_kelamin' => 'required',
            'tanggal_lahir' => 'required',
            'tempat_lahir' => 'required',
            'alamat' => 'required',
            'hp' => 'required',
            'email' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->nama_dosen,
                'email' => $request->email,
                'password' => $request->nidn
            ]);

            Dosen::create([
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

            
            return back()->with('success', 'Berhasil menambahkan data dosen baru');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
    }
}
