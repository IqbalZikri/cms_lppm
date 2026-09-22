<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Pkm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PkmController extends Controller
{
    public function index()
    {
        $data = Pkm::latest()->paginate(10);
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('admin/pkm/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            'dosen' => $dosen,
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/create', [
            'fakultas' => $fakultas
        ]);
    }
}
