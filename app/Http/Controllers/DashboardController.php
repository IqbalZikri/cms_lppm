<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Kegiatan;
use App\Models\Pkm;
use Inertia\Inertia;
use Log;

class DashboardController extends Controller
{
    public function index()
    {
        $dosens = Dosen::latest()->take(5)->with('fakultas', 'prodi')->get();
        $kegiatan = Kegiatan::latest()->get();
        $pkm = Pkm::latest()->get();
        $user = auth()->user();
        return Inertia::render('admin/dashboard', [
            'dosen' => $dosens,
            'kegiatan' => $kegiatan,
            'pkm' => $pkm,
            'user' => $user,
        ]);
    }
}
