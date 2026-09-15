<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FakultasController extends Controller
{
    public function index(){
        $fakultas = Fakultas::get();

        return Inertia::render('fakultas/index', [
            'data' => $fakultas
        ]);
    }
}
