<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;

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

    public function show(string $id)
    {
        $dosen = Dosen::with('fakultas', 'prodi', 'user')->findOrFail($id)->load('scorePenelitian');
        $user = User::findOrFail($dosen->user_id);

        return Inertia::render('uppm/dosen/show', [
            'dosen' => [
                ...$dosen->toArray(),
                'foto' => $dosen->foto
                    ? Storage::url($dosen->foto)
                    : null,
            ],
            'user' => $user,
        ]);
    }
}
