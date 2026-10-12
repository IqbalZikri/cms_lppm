<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Hki;
use App\Models\Kegiatan;
use App\Models\LuaranBuku;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 4; // 5 tahun terakhir

        $userLogin = auth()->user()->id;
        $dosenLogin = Dosen::where('user_id', $userLogin)->with('penulis', 'fakultas')->first();
        if (!$dosenLogin) {
            return back()->with("error", "Terjadi Kesalahan");
        }
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
        $totalLuaranBuku = LuaranBuku::whereHas('penulis', function ($query) use ($dosenLogin) {
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
        $luaranBukuTerbaru = LuaranBuku::whereHas("penulis", function ($query) use ($dosenLogin) {
            $query->where('dosen_id', $dosenLogin->id);
        })->latest()->take(10)->get();

        $countByYear = fn(string $model) => $model::whereBetween('tahun', [$startYear, $currentYear])
            ->selectRaw('tahun, COUNT(*) as total')
            ->whereHas("penulis", function ($query) use ($dosenLogin) {
                $query->where('dosen_id', $dosenLogin->id);
            })
            ->groupBy('tahun')
            ->pluck('total', 'tahun');

        $series = [
            'kegiatan' => $countByYear(Kegiatan::class),
            'pkm' => $countByYear(Pkm::class),
            'hki' => $countByYear(Hki::class),
            'luaran_jurnal' => $countByYear(LuaranJurnal::class),
            'prosiding' => $countByYear(LuaranProsiding::class),
            'buku' => $countByYear(LuaranBuku::class),
        ];

        // semua tahun dalam rentang tetap tampil, walau 0
        $chartData = collect(range($startYear, $currentYear))
            ->map(fn($tahun) => [
                'tahun' => $tahun,
                'kegiatan' => (int) ($series['kegiatan'][$tahun] ?? 0),
                'pkm' => (int) ($series['pkm'][$tahun] ?? 0),
                'hki' => (int) ($series['hki'][$tahun] ?? 0),
                'luaran_jurnal' => (int) ($series['luaran_jurnal'][$tahun] ?? 0),
                'prosiding' => (int) ($series['prosiding'][$tahun] ?? 0),
                'buku' => (int) ($series['buku'][$tahun] ?? 0),
            ])
            ->values();

        return Inertia::render('dosen/dashboard', [
            'dosenLogin' => $dosenLogin,
            'totalKegiatan' => $totalKegiatan,
            'totalPkm' => $totalPkm,
            'totalHki' => $totalHki,
            'totalLuaranJurnal' => $totalLuaranJurnal,
            'totalLuaranProsiding' => $totalLuaranProsiding,
            'totalLuaranBuku' => $totalLuaranBuku,

            'kegiatanTerbaru' => $kegiatanTerbaru,
            'pkmTerbaru' => $pkmTerbaru,
            'hkiTerbaru' => $hkiTerbaru,
            'luaranJurnalTerbaru' => $luaranJurnalTerbaru,
            'luaranProsidingTerbaru' => $luaranProsidingTerbaru,
            'luaranBukuTerbaru' => $luaranBukuTerbaru,
            'chartData' => $chartData,
        ]);
    }
}
