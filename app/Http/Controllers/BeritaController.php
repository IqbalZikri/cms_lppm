<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $data = Berita::paginate(10);

        return Inertia::render('berita/index', [
            'data' => $data
        ]);
    }

    public function create()
    {

    }
}
