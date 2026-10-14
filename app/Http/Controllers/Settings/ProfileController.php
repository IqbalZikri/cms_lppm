<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Dosen;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Log;
use Storage;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $role = auth()->user()->role;

        switch ($role) {
            case 'dosen':
                $dosen = $request->user()->dosen()
                    ->with(['fakultas:id,nama_fakultas', 'prodi:id,nama_prodi'])
                    ->firstOrFail();

                return Inertia::render('dosen/profile', [
                    'dosen' => [
                        ...$dosen->only([
                            'id',
                            'sintaid',
                            'nidn',
                            'nuptk',
                            'nama_dosen',
                            'pendidikan_terakhir',
                            'jabatan_fungsional',
                            'gelar_depan',
                            'gelar_belakang',
                            'jenis_kelamin',
                            'tempat_lahir',
                            'alamat',
                            'hp',
                            'email',
                        ]),
                        'tanggal_lahir' => $dosen->tanggal_lahir?->format('Y-m-d'),
                        'fakultas' => $dosen->fakultas?->nama_fakultas,
                        'prodi' => $dosen->prodi?->nama_prodi,
                        'foto' => $dosen->foto ? Storage::disk('public')->url($dosen->foto) : null,
                    ],
                ]);
                break;

            case 'uppm':
                return Inertia::render('uppm/profile', [
                    'status' => $request->session()->get('status'),
                ]);
                break;

            default:
                return Inertia::render('settings/profile', [
                    'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                    'status' => $request->session()->get('status'),
                ]);
                break;
        }

    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    public function updateProfileDosen(Request $request, $id)
    {
        $request->validate([
            'sintaid' => "required",
            'nidn' => "required_without:nuptk",
            'nuptk' => "required_without:nidn",
            'nama_dosen' => "required",
            'pendidikan_terakhir' => "required",
            'jabatan_fungsional' => "required",
            'tanggal_lahir' => "required",
            'tempat_lahir' => "required",
            'alamat' => "required",
            'hp' => "required",
            'email' => "required",
        ], [
            'sintaid.required' => "Sintaid wajib diisi",
            'nidn.required_without' => "NIDN wajib diisi",
            'nuptk.required_without' => "NUPTK wajib diisi",
            'nama_dosen.required' => "Nama Dosen wajib diisi",
            'pendidikan_terakhir.required' => "Pendidikan Terakhir wajib diisi",
            'jabatan_fungsional.required' => "Jabatan Fungsional wajib diisi",
            'tanggal_lahir.required' => "Tanggal lahir wajib diisi",
            'tempat_lahir.required' => "Tempat lahir wajib diisi",
            'alamat.required' => "Alamat wajib diisi",
            'hp.required' => "No. Hp wajib diisi",
            'email.required' => "email wajib diisi",
        ]);

        try {
            $dosen = Dosen::findOrFail($id);
            $user = auth()->user();

            $foto = null;
            if ($request->hasFile('foto')) {
                $lama = $user->getRawOriginal('avatar');
                if ($lama) {
                    Storage::disk('public')->delete($lama);
                }
                $foto = $request->file('foto')->store('dosen', 'public');
            } else {
                $foto = $user->getRawOriginal('avatar');
            }

            $user->update([
                'name' => $request->nama_dosen,
                'email' => $request->email,
                'password' => $request->nidn,
                'avatar' => $foto,
            ]);

            $dosen->update([
                'sintaid' => $request->input("sintaid"),
                'nidn' => $request->input("nidn"),
                'nuptk' => $request->input("nuptk"),
                'nama_dosen' => $request->input("nama_dosen"),
                'pendidikan_terakhir' => $request->input("pendidikan_terakhir"),
                'jabatan_fungsional' => $request->input("jabatan_fungsional"),
                'gelar_depan' => $request->input("gelar_depan"),
                'gelar_belakang' => $request->input("gelar_belakang"),
                'jenis_kelamin' => $request->input("jenis_kelamin"),
                'tanggal_lahir' => $request->input("tanggal_lahir"),
                'tempat_lahir' => $request->input("tempat_lahir"),
                'alamat' => $request->input("alamat"),
                'hp' => $request->input("hp"),
                'email' => $request->input("email"),
                'foto' => $foto,
            ]);

            return back()->with("success", "Berhasil update profile");
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return back()->with("error", "Terjadi Kesalahan");
        }
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
