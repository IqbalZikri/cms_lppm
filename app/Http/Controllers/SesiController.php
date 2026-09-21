<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\User;
use Auth;
use DB;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class SesiController extends Controller
{
    public function register()
    {
        $fakultas = Fakultas::get();
        $prodi = Prodi::get();
        return Inertia::render('auth/register', [
            'fakultas' => $fakultas,
            'prodi' => $prodi
        ]);
    }

    public function registerAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => 'required|email|max:255|unique:users,email',

            'password' => 'required|string|min:8|confirmed',

            'fakultas_id' => 'required|exists:fakultas,id',

            'prodi_id' => [
                'required',
                Rule::exists('prodis', 'id')->where('fakultas_id', $request->fakultas_id),
            ],

            'nidn' => 'required_without:nuptk|nullable|string|max:20',

            'nuptk' => 'required_without:nidn|nullable|string|max:20',

            'jenis_kelamin' => 'required|in:L,P',

            'tanggal_lahir' => 'required|date|before_or_equal:today',

            'alamat' => 'required|string|max:255',

            'tempat_lahir' => 'required|string|max:100',

            'hp' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
        ], [
            'name.required' => 'Silakan masukkan nama dosen.',
            'name.string' => 'Nama dosen harus berupa teks.',
            'name.max' => 'Nama dosen tidak boleh lebih dari 255 karakter.',

            'email.required' => 'Silakan masukkan alamat email.',
            'email.email' => 'Silakan masukkan alamat email dengan format yang valid.',
            'email.max' => 'Alamat email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Alamat email anda sudah terdaftar.',

            'password.required' => 'Silakan masukkan password.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal harus terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',

            'fakultas_id.required' => "Silahkan pilih salah satu fakultas",
            'fakultas_id.exists' => "Data fakultas tidak tercantum di sistem",

            'prodi_id.required' => "Silahkan pilih salah satu prodi",
            'prodi_id.exists' => "Data prodi tidak tercantum di sistem",

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

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'], // lihat catatan di bawah
                'role' => 'dosen', // lihat catatan di bawah
            ]);

            Dosen::create([
                'user_id' => $user->id,
                'nama_dosen' => $validated['name'],
                'fakultas_id' => $validated['fakultas_id'],
                'prodi_id' => $validated['prodi_id'],
                'nidn' => $validated['nidn'] ?? null,
                'nuptk' => $validated['nuptk'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'alamat' => $validated['alamat'],
                'hp' => $validated['hp'],
                'email' => $validated['email'],
            ]);

            DB::commit();

            event(new Registered($user));   // memicu pengiriman email verifikasi
            Auth::login($user);

            return redirect()->route('verification.notice');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Gagal registrasi dosen', ['exception' => $th]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function login()
    {
        return Inertia::render('auth/login');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if (auth()->user()->role === 'dosen') {
                return redirect()->route('dosen.dashboard');
            } elseif (auth()->user()->role === 'uppm') {
                return redirect()->route('uppm.dashboard');
            } else {
                return redirect()->route('admin.dashboard');
            }

        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
