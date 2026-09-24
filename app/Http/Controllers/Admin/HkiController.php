<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Hki;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class HkiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Hki::latest()->paginate(10);
        $data->load('penulis');
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
            'nomer_paten' => 'required_if:jenis_hki,paten',
            'nomer_pengajuan_haki' => 'required_if:jenis_hki,haki',
            'jumlah_dana' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id|distinct',
            'authors.*.nama_fakultas' => 'required',
            'authors.*.nama_dosen' => 'required',
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
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
            'authors.*.dosen_id.distinct' => 'Duplikat nama dosen',
        ]);

        DB::beginTransaction();

        try {

            $hki = Hki::create([
                'jenis_hki' => $validated['jenis_hki'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'nomer_pengajuan_haki' => $validated['nomer_pengajuan_haki'] ?? null,
                'nomer_paten' => $validated['nomer_paten'] ?? null,
                'sumber_dana' => $validated['sumber_dana'] ?? null,
                'jumlah_dana' => $validated['jumlah_dana'] ?? null,
            ]);

            foreach ($validated['authors'] as $i => $author) {
                $hki->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'nama_dosen' => $author['nama_dosen'],
                    'nama_fakultas' => $author['nama_fakultas'],
                    'urutan' => $i + 1,
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
        return Inertia::render('admin/hki/show', [
            'hki' => $hki->with('penulisRelasi')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hki $hki)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $hki->load('penulis');
        Log::info($hki);
        return Inertia::render('admin/hki/edit', [
            'data' => $hki,
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hki $hki)
    {
        $validated = $request->validate([
            'jenis_hki' => ['required', Rule::in(['paten', 'haki'])],
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'nomer_paten' => 'required_if:jenis_hki,paten',
            'nomer_pengajuan_haki' => 'required_if:jenis_hki,haki',
            'jumlah_dana' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id|distinct',
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
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
            'authors.*.dosen_id.distinct' => 'Duplikat nama dosen',
        ]);

        DB::beginTransaction();

        try {

            $hki->update([
                'jenis_hki' => $validated['jenis_hki'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'nomer_pengajuan_haki' => $validated['nomer_pengajuan_haki'] ?? null,
                'nomer_paten' => $validated['nomer_paten'] ?? null,
                'sumber_dana' => $validated['sumber_dana'] ?? null,
                'jumlah_dana' => $validated['jumlah_dana'] ?? null,
            ]);

            $dosens = Dosen::whereIn('id', collect($validated['authors'])->pluck('dosen_id'))
                ->get()
                ->keyBy('id');

            $fakultas = Fakultas::whereIn('id', collect($validated['authors'])->pluck('fakultas_id'))
                ->get()
                ->keyBy('id');

            $hki->penulis()->delete();
            foreach ($validated['authors'] as $i => $author) {
                $hki->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'nama_dosen' => $dosens[$author['dosen_id']]->nama_dosen,
                    'nama_fakultas' => $fakultas[$author['fakultas_id']]->nama_fakultas,
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.hki.index')->with('success', 'Berhasil mengedit HKI');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hki $hki)
    {
        try {
            $hki->penulis()->delete();
            $hki->delete();
            return redirect()->route('admin.hki.index')->with('success', 'Berhasil menghapus HKI');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
