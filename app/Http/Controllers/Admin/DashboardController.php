<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Hki;
use App\Models\Kegiatan;
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
        $dosens = Dosen::latest()->take(5)->with('fakultas', 'prodi', 'user')->get();
        $totalDosen = Dosen::count();
        $kegiatan = Kegiatan::latest()->take(5)->get();
        $totalKegiatan = Kegiatan::count();
        $pkm = Pkm::latest()->take(5)->get();
        $totalPkm = Pkm::count();
        $hki = Hki::latest()->take(5)->get();
        $totalHki = Hki::count();
        $luaranJurnal = LuaranJurnal::latest()->take(5)->get();
        $totalLuaranJurnal = LuaranJurnal::count();
        $luaranProsiding = LuaranProsiding::latest()->take(5)->get();
        $totalLuaranProsiding = LuaranProsiding::count();
        $user = auth()->user();

        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 2; // 3 tahun terakhir, sesuaikan kebutuhan

        $dataSources = [
            'kegiatan' => Kegiatan::whereBetween('tahun', [$startYear, $currentYear])->get(['tahun']),
            'pkm' => Pkm::whereBetween('tahun', [$startYear, $currentYear])->get(['tahun']),
            'hki' => Hki::whereBetween('tahun', [$startYear, $currentYear])->get(['tahun']),
            'luaran_jurnal' => LuaranJurnal::whereBetween('tahun', [$startYear, $currentYear])->get(['tahun']),
            'prosiding' => LuaranProsiding::whereBetween('tahun', [$startYear, $currentYear])->get(['tahun']),
        ];

        $grouped = [];
        foreach ($dataSources as $key => $items) {
            foreach ($items->groupBy('tahun') as $tahun => $group) {
                $grouped[$tahun][$key] = $group->count();
            }
        }

        // isi semua tahun dalam rentang, walau count-nya 0, biar chart nggak bolong
        $chartData = collect(range($startYear, $currentYear))
            ->map(fn($tahun) => array_merge(
                ['date' => "$tahun-01-01", 'tahun' => $tahun],
                array_fill_keys(['kegiatan', 'pkm', 'hki', 'luaran_jurnal', 'prosiding'], 0),
                $grouped[$tahun] ?? []
            ))
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
            'chartData' => $chartData
        ]);
    }
}
