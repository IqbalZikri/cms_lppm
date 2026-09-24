<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HkiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Hki::latest()->paginate(10);
        return Inertia::render('admin/hki/index', [
            'data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        return Inertia::render('admin/hki/create', [
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_hki' => ['required', Rule::in(['paten', 'haki'])],
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'nomer_pengajuan_haki' => 'required_if:jenis_hki,paten',
            'nomer_paten' => 'required_if:jenis_hki,haki',
            'jumlah_dana' => 'required',
            'sumber_dana' => 'required',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'jenis_hki.required' => 'Silahkan pilih salah satu jenis HKI',
            'jenis_hki.in' => 'Jenis HKI tidak valid',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'nomer_pengajuan_haki.required_if' => 'Silahkan isi nomer pengajuan haki',
            'nomer_paten.required_if' => 'Silahkan isi nomer paten',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
        ]);

        DB::beginTransaction();

        try {
            $dosenIds = collect($validated['authors'])->pluck('dosen_id');
            $dosenMap = Dosen::whereIn('id', $dosenIds)->pluck('nama_dosen', 'id');

            $fakultasIds = collect($validated['authors'])->pluck('fakultas_id');
            $fakultasMap = Fakultas::whereIn('id', $fakultasIds)->pluck('nama_fakultas', 'id');

            $hki = Hki::create([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'nomer_pengajuan_hki' => $validated['nomer_pengajuan_hki'],
                'nomer_paten' => $validated['nomer_paten'],
            ]);

            foreach ($validated['authors'] as $author) {
                $hki->penulisRelasi()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                ]);
            }

            DB::commit();

            return redirect()->route('admin.hki.index')->with('success', 'Berhasil menambahkan HKI');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Hki $hki)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hki $hki)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hki $hki)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hki $hki)
    {
        //
    }
}
