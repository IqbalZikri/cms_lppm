<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use App\Models\Kegiatan;
use App\Models\LuaranBuku;
use App\Models\LuaranJurnal;
use App\Models\LuaranProsiding;
use App\Models\Pkm;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 4; // 5 tahun terakhir

        $userLogin = auth()->user();
        $fakultasSesuai = Fakultas::findOrFail($userLogin->fakultas_id)->with('penulis')->first();

        $queryKegiatan = Kegiatan::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $queryPkm = Pkm::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $queryHki = Hki::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $queryLuaranJurnal = LuaranJurnal::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $queryLuaranProsiding = LuaranProsiding::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $queryLuaranBuku = LuaranBuku::whereHas('penulis', function ($query) use ($fakultasSesuai) {
            $query->where('fakultas_id', $fakultasSesuai->id);
        })->with('penulis.fakultas', 'penulis.dosen');

        $totalDosen = Dosen::where('fakultas_id', $fakultasSesuai->id)->count();
        $totalKegiatan = $queryKegiatan->clone()->count();
        $totalPkm = $queryPkm->clone()->count();
        $totalHki = $queryHki->clone()->count();
        $totalLuaranJurnal = $queryLuaranJurnal->clone()->count();
        $totalLuaranProsiding = $queryLuaranProsiding->clone()->count();
        $totalLuaranBuku = $queryLuaranBuku->clone()->count();

        $dosenTerbaru = Dosen::where("fakultas_id", $fakultasSesuai->id)->with('user', 'fakultas', 'prodi')->latest()->take(5)->get();
        $kegiatanTerbaru = $queryKegiatan->clone()->latest()->take(5)->get();
        $pkmTerbaru = $queryPkm->clone()->latest()->take(5)->get();
        $hkiTerbaru = $queryHki->clone()->latest()->take(5)->get();
        $luaranJurnalTerbaru = $queryLuaranJurnal->clone()->latest()->take(5)->get();
        $luaranProsidingTerbaru = $queryLuaranProsiding->clone()->latest()->take(5)->get();
        $luaranBukuTerbaru = $queryLuaranBuku->clone()->latest()->take(5)->get();

        $countByYear = fn(string $model) => $model::whereBetween('tahun', [$startYear, $currentYear])
            ->selectRaw('tahun, COUNT(*) as total')
            ->whereHas("penulis", function ($query) use ($fakultasSesuai) {
                $query->where('fakultas_id', $fakultasSesuai->id);
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

        return Inertia::render('uppm/dashboard', [
            'user' => $userLogin,
            'totalDosen' => $totalDosen,
            'totalKegiatan' => $totalKegiatan,
            'totalPkm' => $totalPkm,
            'totalHki' => $totalHki,
            'totalLuaranJurnal' => $totalLuaranJurnal,
            'totalLuaranProsiding' => $totalLuaranProsiding,
            'totalLuaranBuku' => $totalLuaranBuku,
            'dosenTerbaru' => $dosenTerbaru,
            'kegiatanTerbaru' => $kegiatanTerbaru,
            'pkmTerbaru' => $pkmTerbaru,
            'hkiTerbaru' => $hkiTerbaru,
            'luaranJurnalTerbaru' => $luaranJurnalTerbaru,
            'luaranProsidingTerbaru' => $luaranProsidingTerbaru,
            'luaranBukuTerbaru' => $luaranBukuTerbaru,
            "chartData" => $chartData
        ]);
    }
}
