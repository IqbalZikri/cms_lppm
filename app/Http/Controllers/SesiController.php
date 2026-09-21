<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class SesiController extends Controller
{
    public function register()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('auth/register', [
            'fakultas' => $fakultas
        ]);
    }

    public function registerAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => 'required|email|max:255',

            'password' => 'required|string|min:8|confirmed',

            'nidn' => 'required_without:nuptk|nullable|string|max:20',

            'nuptk' => 'required_without:nidn|nullable|string|max:20',

            'jenis_kelamin' => 'required|in:L,P',

            'tanggal_lahir' => 'required|date|before_or_equal:today',

            'tempat_lahir' => 'required|string|max:100',

            'hp' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
        ], [
            'name.required' => 'Silakan masukkan nama dosen.',
            'name.string' => 'Nama dosen harus berupa teks.',
            'name.max' => 'Nama dosen tidak boleh lebih dari 255 karakter.',

            'email.required' => 'Silakan masukkan alamat email.',
            'email.email' => 'Silakan masukkan alamat email dengan format yang valid.',
            'email.max' => 'Alamat email tidak boleh lebih dari 255 karakter.',

            'password.required' => 'Silakan masukkan password.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal harus terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',

            'nidn.required_without' => 'Silakan masukkan NIDN atau NUPTK.',
            'nidn.max' => 'NIDN tidak boleh lebih dari 20 karakter.',

            'nuptk.required_without' => 'Silakan masukkan NUPTK atau NIDN.',
            'nuptk.max' => 'NUPTK tidak boleh lebih dari 20 karakter.',

            'jenis_kelamin.required' => 'Silakan pilih jenis kelamin.',
            'jenis_kelamin.in' => 'Jenis kelamin yang dipilih tidak valid.',

            'tanggal_lahir.required' => 'Silakan masukkan tanggal lahir.',
            'tanggal_lahir.date' => 'Tanggal lahir harus berupa tanggal yang valid.',
            'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi tanggal hari ini.',

            'tempat_lahir.required' => 'Silakan masukkan tempat lahir.',
            'tempat_lahir.string' => 'Tempat lahir harus berupa teks.',
            'tempat_lahir.max' => 'Tempat lahir tidak boleh lebih dari 100 karakter.',

            'hp.required' => 'Silakan masukkan nomor HP.',
            'hp.string' => 'Nomor HP harus berupa teks.',
            'hp.regex' => 'Nomor HP harus terdiri dari 10 hingga 15 digit dan dapat diawali dengan tanda +.',
        ]);

        dd($validated);

        DB::beginTransaction();

        try {
            // $user =     
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
