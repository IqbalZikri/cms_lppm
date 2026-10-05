<?php

namespace App\Http\Controllers\Uppm;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Prodi::where('fakultas_id', auth()->user()->fakultas_id)->search($request->query("search"))->with("fakultas")->paginate(10)->withQueryString();
        return Inertia::render("uppm/prodi/index", [
            'data' => $data,
            'filters' => $request->only("search")
        ]);
    }
}
