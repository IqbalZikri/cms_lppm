<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use App\Models\LuaranProsiding;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranProsidingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = LuaranProsiding::latest()->paginate(10);
        $fakultas = Fakultas::select('id','nama_fakultas')->get();
        return Inertia::render('admin/luaran-prosiding/index', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LuaranProsiding $luaranProsiding)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranProsiding $luaranProsiding)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LuaranProsiding $luaranProsiding)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LuaranProsiding $luaranProsiding)
    {
        //
    }
}
