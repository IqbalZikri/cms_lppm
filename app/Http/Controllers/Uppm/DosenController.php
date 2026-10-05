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
    public function index(Request $request)
    {
        $queryDosen = Dosen::where('fakultas_id', auth()->user()->fakultas_id);

        $totalDosen = Dosen::count();
        $totalLaki = Dosen::where('jenis_kelamin', 'L')->count();
        $totalPerempuan = Dosen::where('jenis_kelamin', 'P')->count();
        $dataTabelDosen = $queryDosen->clone()->search($request->query("search"))->latest()->with('prodi')->paginate(10)->withQueryString();
        return Inertia::render('uppm/dosen/index', [
            'totalDosen' => $totalDosen,
            'totalLaki' => $totalLaki,
            'totalPerempuan' => $totalPerempuan,
            'data' => $dataTabelDosen,
            'filters' => $request->only("search")
        ]);
    }
}
