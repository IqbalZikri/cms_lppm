<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SesiController extends Controller
{
    public function loginPage()
    {
        return Inertia::render();
    }
}
