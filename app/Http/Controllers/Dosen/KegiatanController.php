<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Kegiatan;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class KegiatanController extends Controller
{
    public function index()
    {
        $dosen = Dosen::where('user_id', auth()->user()->id)->with('penulis', 'fakultas')->first();
        $kegiatan = Kegiatan::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10);
        return Inertia::render('dosen/kegiatan/index', [
            'kegiatan' => $kegiatan
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('dosen/kegiatan/create', [
            'fakultas' => $fakultas,
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => 'required',
            'jumlah_dana' => 'required|numeric',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'judul.required' => 'Silahkan isi judul kegiatan',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
        ]);

        DB::beginTransaction();

        try {
            $kegiatan = Kegiatan::create([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                $kegiatan->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('dosen.kegiatan.index')->with('success', 'Berhasil menambahkan penelitian kegiatan');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        $data->load('penulis.fakultas', 'penulis.dosen');
        $fakultas = Fakultas::get();
        return Inertia::render('dosen/kegiatan/show', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        $kegiatan->load('penulis');
        $fakultas = Fakultas::get();
        $dosen = Dosen::get();
        return Inertia::render('dosen/kegiatan/edit', [
            'kegiatan' => $kegiatan,
            'fakultas' => $fakultas,
            'dosen' => $dosen,
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'jumlah_dana' => 'required|numeric',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id|distinct',
        ], [
            'judul.required' => 'Silahkan isi judul kegiatan',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap penulis',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap penulis',
            'authors.*.dosen_id.distinct' => 'Duplikat nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $kegiatan->update([
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
            ]);

            $kegiatan->penulis()->delete();

            foreach ($validated['authors'] as $i => $author) {
                $kegiatan->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('dosen.kegiatan.index')->with('success', 'Berhasil memperbarui kegiatan penelitian');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Kegiatan::findOrFail($id);
        try {
            $data->penulis()->delete();
            $data->delete();
            return back()->with('success', 'Berhasil menghapus kegiatan penelitian');
        } catch (\Throwable $th) {
            Log::info($th->getMessage(), $th->getTrace());
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
