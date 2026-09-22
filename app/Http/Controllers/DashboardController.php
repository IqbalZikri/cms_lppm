<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Jurnal;
use App\Models\Penelitian;
use App\Models\Pkm;
use Inertia\Inertia;
use Log;

class DashboardController extends Controller
{
    public function index()
    {
        $dosens = Dosen::count();
        // $penelitian = Penelitian::count();
        // $pkm = Pkm::count();
        // $jurnal = Jurnal::count();
        $user = auth()->user();
        return Inertia::render('admin/dashboard', [
            'dosens' => $dosens,
            // 'penelitian' => $penelitian,
            // 'pkm' => $pkm,
            // 'jurnal' => $jurnal,
            'user' => $user,
        ]);
    }
}
