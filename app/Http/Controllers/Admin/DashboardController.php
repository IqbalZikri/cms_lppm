<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Hki;
use App\Models\Kegiatan;
use App\Models\LuaranBuku;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use Carbon\Carbon;
use Inertia\Inertia;
use Log;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 4; // 5 tahun terakhir

        $dosens = Dosen::latest()->take(5)->with('fakultas', 'prodi', 'user')->get();
        $totalDosen = Dosen::count();
        $kegiatan = Kegiatan::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalKegiatan = Kegiatan::whereBetween('tahun', [$startYear, $currentYear])->count();
        $pkm = Pkm::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalPkm = Pkm::whereBetween('tahun', [$startYear, $currentYear])->count();
        $hki = Hki::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalHki = Hki::whereBetween('tahun', [$startYear, $currentYear])->count();
        $luaranJurnal = LuaranJurnal::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalLuaranJurnal = LuaranJurnal::whereBetween('tahun', [$startYear, $currentYear])->count();
        $luaranProsiding = LuaranProsiding::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalLuaranProsiding = LuaranProsiding::whereBetween('tahun', [$startYear, $currentYear])->count();
        $luaranBuku = LuaranBuku::latest()->with('penulis.fakultas', 'penulis.dosen')->take(5)->get();
        $totalLuaranBuku = LuaranBuku::whereBetween('tahun', [$startYear, $currentYear])->count();
        $user = auth()->user();

        // hasil: [tahun => total]
        $countByYear = fn(string $model) => $model::whereBetween('tahun', [$startYear, $currentYear])
            ->selectRaw('tahun, COUNT(*) as total')
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

        return Inertia::render('admin/dashboard', [
            'dosen' => $dosens,
            'totalDosen' => $totalDosen,
            'kegiatan' => $kegiatan,
            'totalKegiatan' => $totalKegiatan,
            'pkm' => $pkm,
            'totalPkm' => $totalPkm,
            'user' => $user,
            'hki' => $hki,
            'totalHki' => $totalHki,
            'luaranJurnal' => $luaranJurnal,
            'totalLuaranJurnal' => $totalLuaranJurnal,
            'luaranProsiding' => $luaranProsiding,
            'totalLuaranProsiding' => $totalLuaranProsiding,
            'luaranBuku' => $luaranBuku,
            'totalLuaranBuku' => $totalLuaranBuku,
            'chartData' => $chartData,
        ]);
    }
}
