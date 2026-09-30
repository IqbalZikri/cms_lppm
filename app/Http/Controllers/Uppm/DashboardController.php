<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use App\Models\Kegiatan;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userLogin = auth()->user();
        $fakultasSesuai = Fakultas::findOrFail($userLogin->fakultas_id)->with('penulis')->first();

        $queryKegiatan = Kegiatan::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        });

        $queryPkm = Pkm::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        });

        $queryHki = Hki::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        });

        $queryLuaranJurnal = LuaranJurnal::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        });

        $queryLuaranProsiding = LuaranProsiding::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        });

        $totalDosen = Dosen::where('fakultas_id', $fakultasSesuai->id)->count();
        $totalKegiatan = $queryKegiatan->clone()->count();
        $totalPkm = $queryPkm->clone()->count();
        $totalHki = $queryHki->clone()->count();
        $totalLuaranJurnal = $queryLuaranJurnal->clone()->count();
        $totalLuaranProsiding = $queryLuaranProsiding->clone()->count();

        $dosenTerbaru = Dosen::where("fakultas_id", $fakultasSesuai->id)->with('user')->latest()->take(5)->get();
        $kegiatanTerbaru = $queryKegiatan->clone()->latest()->take(5)->get();
        $pkmTerbaru = $queryPkm->clone()->latest()->take(5)->get();
        $hkiTerbaru = $queryHki->clone()->latest()->take(5)->get();
        $luaranJurnalTerbaru = $queryLuaranJurnal->clone()->latest()->take(5)->get();
        $luaranProsidingTerbaru = $queryLuaranProsiding->clone()->latest()->take(5)->get();

        return Inertia::render('uppm/dashboard', [
            'user' => $userLogin,
            'totalDosen' => $totalDosen,
            'totalKegiatan' => $totalKegiatan,
            'totalPkm' => $totalPkm,
            'totalHki' => $totalHki,
            'totalLuaranJurnal' => $totalLuaranJurnal,
            'totalLuaranProsiding' => $totalLuaranProsiding,
            'dosenTerbaru' => $dosenTerbaru,
            'kegiatanTerbaru' => $kegiatanTerbaru,
            'pkmTerbaru' => $pkmTerbaru,
            'hkiTerbaru' => $hkiTerbaru,
            'luaranJurnalTerbaru' => $luaranJurnalTerbaru,
            'luaranProsidingTerbaru' => $luaranProsidingTerbaru,
        ]);
    }
}
