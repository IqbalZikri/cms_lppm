<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Storage;

class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Dosen::paginate(10);
        $fakultas = Fakultas::with('dosen')->get();
        $prodi = Prodi::get();

        return Inertia::render('admin/dosen/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            'prodi' => $prodi,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::get();

        return Inertia::render('admin/dosen/create', [
            'fakultas' => $fakultas,
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
            'foto' => 'nullable|mimes:png,jpg,jpeg|max:2048',
            'email' => 'required|unique:users,email',
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'prodi_id.required' => 'Pilih salah satu prodi',
            'nidn.required' => 'NIDN wajib diisi',
            'nama_dosen.required' => 'Nama dosen wajib diisi',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi',
            'alamat.required' => 'Alamat wajib diisi',
            'hp.required' => 'No. Hp wajib diisi',
            'foto.mimes' => 'Format yang didukung: png, jpg, jpeg',
            'foto.max' => 'Maksimal ukuran file 2MB',
            'email.required' => 'Email wajib diisi',
        ]);

        DB::beginTransaction();

        try {
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto')->store('dosen', 'public');
            }

            $user = User::create([
                'name' => $request->nama_dosen,
                'email' => $request->email,
                'password' => $request->nidn,
                'role' => 'dosen',
            ]);

            Dosen::create([
                'fakultas_id' => $request->fakultas_id,
                'prodi_id' => $request->prodi_id,
                'nidn' => $request->nidn,
                'nuptk' => $request->nuptk,
                'nama_dosen' => $request->nama_dosen,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tanggal_lahir' => $request->tanggal_lahir,
                'tempat_lahir' => $request->tempat_lahir,
                'alamat' => $request->alamat,
                'hp' => $request->hp,
                'foto' => $foto ?? null,
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
        $dosen = Dosen::with('fakultas', 'prodi', 'user')->findOrFail($id);
        $user = User::findOrFail($dosen->user_id);

        return Inertia::render('admin/dosen/show', [
            'dosen' => [
                ...$dosen->toArray(),
                'foto' => $dosen->foto
                    ? Storage::url($dosen->foto)
                    : null,
            ],
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $dosen = Dosen::findOrFail($id);
        $fakultas = Fakultas::get();
        $user = User::findOrFail($dosen->user_id);

        return Inertia::render('admin/dosen/edit', [
            'dosen' => [
                ...$dosen->toArray(),
                'foto' => $dosen->foto
                    ? Storage::url($dosen->foto)
                    : null,
            ],
            'fakultas' => $fakultas,
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'fakultas_id' => 'required',
            'prodi_id' => 'required',
            'nidn' => 'required|unique:dosens,nidn,' . $id,
            'nama_dosen' => 'required',
            'jenis_kelamin' => 'required',
            'tanggal_lahir' => 'required',
            'tempat_lahir' => 'required',
            'alamat' => 'required',
            'hp' => 'required',
            'foto' => 'nullable|mimes:png,jpg,jpeg|max:2048',
            'email' => 'required|unique:dosens,email,' . $id,
        ], [
            'fakultas_id.required' => 'Pilih salah satu fakultas',
            'prodi_id.required' => 'Pilih salah satu prodi',
            'nidn.required' => 'NIDN wajib diisi',
            'nama_dosen.required' => 'Nama dosen wajib diisi',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi',
            'alamat.required' => 'Alamat wajib diisi',
            'hp.required' => 'No. Hp wajib diisi',
            'foto.mimes' => 'Format yang didukung: png, jpg, jpeg',
            'foto.max' => 'Maksimal ukuran file 2MB',
            'email.required' => 'Email wajib diisi',
        ]);

        DB::beginTransaction();

        $data = Dosen::findOrFail($id);
        $user = User::findOrFail($data->user_id);

        try {
            $foto = null;
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto')->store('dosen', 'public');
            } else {
                $foto = $data->foto;
            }

            $user->update([
                'name' => $request->nama_dosen,
                'email' => $request->email,
                'password' => $request->nidn,
                'role' => 'dosen',
            ]);

            $data->update([
                'fakultas_id' => $request->fakultas_id,
                'prodi_id' => $request->prodi_id,
                'nidn' => $request->nidn,
                'nuptk' => $request->nuptk,
                'nama_dosen' => $request->nama_dosen,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tanggal_lahir' => $request->tanggal_lahir,
                'tempat_lahir' => $request->tempat_lahir,
                'alamat' => $request->alamat,
                'hp' => $request->hp,
                'foto' => $foto ?? null,
                'email' => $request->email,
                'user_id' => $user->id,
            ]);

            DB::commit();

            return redirect()->route('admin.dosen.index')->with('success', 'Berhasil menambahkan data dosen baru');
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Dosen::findOrFail($id);
        try {
            $user = User::findOrFail($data->user_id);
            $user->delete();
            $data->delete();

            return back()->with('success', 'Berhasil menghapus data dosen');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
