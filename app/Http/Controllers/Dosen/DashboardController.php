<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Hki;
use App\Models\Kegiatan;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userLogin = auth()->user()->id;
        $dosenLogin = Dosen::where('user_id', $userLogin)->with('penulis','fakultas')->first();
        $totalKegiatan = Kegiatan::whereHas('penulis', function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->count();
        $totalPkm = Pkm::whereHas('penulis', function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->count();
        $totalHki = Hki::whereHas('penulis', function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->count();
        $totalLuaranJurnal = LuaranJurnal::whereHas('penulis', function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->count();
        $totalLuaranProsiding = LuaranProsiding::whereHas('penulis', function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->count();

        $kegiatanTerbaru = Kegiatan::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();
        $pkmTerbaru = Pkm::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();
        $hkiTerbaru = Hki::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();
        $luaranJurnalTerbaru = LuaranJurnal::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();
        $luaranProsidingTerbaru = LuaranProsiding::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();

        return Inertia::render('dosen/dashboard', [
            'dosenLogin' => $dosenLogin,
            'totalKegiatan' => $totalKegiatan,
            'totalPkm' => $totalPkm,
            'totalHki' => $totalHki,
            'totalLuaranJurnal' => $totalLuaranJurnal,
            'totalLuaranProsiding' => $totalLuaranProsiding,

            'kegiatanTerbaru' => $kegiatanTerbaru,
            'pkmTerbaru' => $pkmTerbaru,
            'hkiTerbaru' => $hkiTerbaru,
            'luaranJurnalTerbaru' => $luaranJurnalTerbaru,
            'luaranProsidingTerbaru' => $luaranProsidingTerbaru,
        ]);
    }
}
