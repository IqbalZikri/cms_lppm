<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Penulis;
use App\Models\Pkm;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class PkmController extends Controller
{
    public function index(Request $request)
    {
        $pkm = Pkm::query()->with('penulis.fakultas', 'penulis.dosen');

        if ($request->filled('cari_fakultas')) {
            $pkm->whereHas('penulis', function ($q) use ($request) {
                $q->where('fakultas_id', $request->cari_fakultas);
            });
        }

        $data = $pkm->clone()->search($request->query('search'))->latest()->paginate(10)->withQueryString();
        $fakultas = Fakultas::select('id', "nama_fakultas")->get();

        $totalPkm = Pkm::count();
        $counts = Penulis::where('penulisable_type', Pkm::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        $totalPkmPerFakultas = $fakultas->map(fn($f) => [
            'label' => $f->nama_fakultas,
            'count' => $counts[$f->id] ?? 0,
        ])->values();

        return Inertia::render('admin/pkm/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            'filters' => $request->only('search', 'cari_fakultas'),
            'totalPkm' => $totalPkm,
            'totalPkmPerFakultas' => $totalPkmPerFakultas,
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/create', [
            'fakultas' => $fakultas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_pkm' => ['required', Rule::in(['pelaksanaan', 'jurnal'])],
            'judul' => 'required',
            'gambar' => 'nullable|max:2048|mimes:png,jpg,jpeg',
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
            'jenis_pkm.required' => 'Silahkan pilih jenis pkm',
            'judul.required' => 'Silahkan isi judul',
            'gambar.max' => 'Gambar tidak bisa lebih dari 2 MB',
            'gambar.mimes' => 'Format file harus berupa jpg / jpeg / png',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
            'authors.*.dosen_id.distinct' => 'Duplikat dosen yang sama',
        ]);

        DB::beginTransaction();

        try {
            $pkm = Pkm::create([
                'jenis_pkm' => $validated['jenis_pkm'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                $pkm->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.pkm.index')->with('success', 'Berhasil menambahkan pkm');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function show($id)
    {
        $data = Pkm::findOrFail($id);
        $data->load('penulis.fakultas', 'penulis.dosen');
        return Inertia::render('admin/pkm/show', [
            'data' => $data
        ]);
    }

    public function edit($id)
    {
        $data = Pkm::findOrFail($id);
        $data->load('penulis');
        $fakultas = Fakultas::get();
        return Inertia::render('admin/pkm/edit', [
            'data' => $data,
            'fakultas' => $fakultas
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'jenis_pkm' => ['required', Rule::in(['pelaksanaan', 'jurnal'])],
            'judul' => 'required',
            'abstrak' => 'required',
            'semester' => 'required',
            'tahun' => 'required',
            'link_berkas' => 'required',
            'sumber_dana' => ['required', Rule::in(['internal', 'eksternal'])],
            'jumlah_dana' => 'required|numeric',
            'authors' => 'required|array|min:1',
            'authors.*.fakultas_id' => 'required|exists:fakultas,id',
            'authors.*.dosen_id' => 'required|exists:dosens,id',
        ], [
            'jenis_pkm.required' => 'Silahkan pilih jenis pkm',
            'judul.required' => 'Silahkan isi judul',
            'abstrak.required' => 'Silahkan isi abstrak',
            'semester.required' => 'Silahkan isi semester',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'sumber_dana.required' => 'Silahkan isi sumber dana',
            'sumber_dana.in' => 'Sumber dana tidak valid',
            'jumlah_dana.required' => 'Silahkan isi jumlah dana',
            'jumlah_dana.numeric' => 'Jumlah dana harus berupa angka',
            'authors.required' => 'Silahkan tambahkan minimal satu  / pelaksana',
            'authors.*.fakultas_id.required' => 'Silahkan pilih fakultas untuk setiap  / pelaksana',
            'authors.*.dosen_id.required' => 'Silahkan pilih dosen untuk setiap  / pelaksana',
        ]);

        DB::beginTransaction();

        try {
            $pkm = Pkm::findOrFail($id);
            $pkm->update([
                'jenis_pkm' => $validated['jenis_pkm'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
                'sumber_dana' => $validated['sumber_dana'],
                'jumlah_dana' => $validated['jumlah_dana'],
            ]);

            $pkm->penulis()->delete();
            foreach ($validated['authors'] as $i => $author) {
                $pkm->penulis()->create([
                    'fakultas_id' => $author['fakultas_id'],
                    'dosen_id' => $author['dosen_id'],
                    'urutan' => $i++,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.pkm.index')->with('success', 'Berhasil memperbarui pkm');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function destroy($id)
    {
        $data = Pkm::findOrFail($id);

        try {
            $data->penulis()->delete();
            $data->delete();
            return back()->with('success', 'Berhasil menghapus pkm');
        } catch (\Throwable $th) {
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
