<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $queryDosen = Dosen::where('fakultas_id', auth()->user()->fakultas_id);

        $totalDosen = $queryDosen->clone()->count();
        $totalLaki = $queryDosen->clone()->where('jenis_kelamin', 'L')->count();
        $totalPerempuan = $queryDosen->clone()->where('jenis_kelamin', 'P')->count();
        $dataSemuaDosen = $queryDosen->clone()->latest()->with('prodi')->paginate(10)->withQueryString();
        return Inertia::render('uppm/dosen/index', [
            'totalDosen' => $totalDosen,
            'totalLaki' => $totalLaki,
            'totalPerempuan' => $totalPerempuan,
            'data' => $dataSemuaDosen,
        ]);
    }
}
