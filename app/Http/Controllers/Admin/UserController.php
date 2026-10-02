<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::query()->whereIn('role', ['admin', 'uppm'])->search($request->query("search"))->oldest('id')->paginate(10)->withQueryString();
        $totalUser = $users->total();
        $totalUppm = User::where('role', 'uppm')->count();
        $totalAdmin = User::where('role', 'admin')->count();
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('admin/user/index', [
            'users' => $users,
            'totalUser' => $totalUser,
            'totalUppm' => $totalUppm,
            'totalAdmin' => $totalAdmin,
            'fakultas' => $fakultas,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users,email',
            'password' => 'required|confirmed',
            'role' => 'required',
            'fakultas_id' => 'exists:fakultas,id',
        ], [
            'name.required' => "Nama akun wajib diisi",
            'email.required' => 'Email wajib diisi',
            'email.unique' => 'Email ini sudah digunakan',
            'password.required' => "Password wajib diisi",
            'password.confirmed' => "Konfirmasi Password wajib diisi",
            'role.required' => 'Pilih salah satu role',
            'fakultas_id.exists' => 'Data fakultas tidak ada di dalam sistem',
        ]);

        try {
            User::create($validated);

            return back()->with('success', 'Berhasil menambahkan data user');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users,email,' . $id,
            'role' => 'required',
            'fakultas_id' => 'exists:fakultas,id',
        ], [
            'name.required' => "Nama akun wajib diisi",
            'email.required' => 'Email wajib diisi',
            'email.unique' => 'Email ini sudah digunakan',
            'role.required' => 'Pilih salah satu role',
            'fakultas_id.exists' => 'Data fakultas tidak ada di dalam sistem',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update($validated);

            return back()->with('success', 'Berhasil mengedit data user');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        try {
            $user->delete();
            return back()->with('success', 'Berhasil menghapus user');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
