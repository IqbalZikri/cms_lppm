<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Penelitian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenelitianController extends Controller
{
    public function index(){
        $penelitian = Penelitian::get();
        return Inertia::render('dosen/penelitian/index', [
            'penelitian' => $penelitian
        ]);
    }
}
