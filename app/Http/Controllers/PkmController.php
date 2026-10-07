<?php

namespace App\Http\Controllers;

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
    public function indexAdmin(Request $request)
    {
        $pkm = Pkm::query()->with('penulis.fakultas', 'penulis.dosen', 'penulisLuar');

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

    public function indexDosen(Request $request)
    {
        $dosen = Dosen::where('user_id', auth()->user()->id)->first();
        $data = Pkm::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
        return Inertia::render('dosen/pkm/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function indexUppm(Request $request)
    {
        $data = Pkm::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();

        return Inertia::render('uppm/pkm/index', [
            'data' => $data,
            'filters' => $request->only("search")
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::get();
        $role = auth()->user()->role;
        return Inertia::render('pkm/create', [
            'fakultas' => $fakultas,
            'role' => $role,
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
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
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
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
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
                if ($author['tipe'] === 'internal') {
                    $pkm->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $pkm->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.pkm.index')->with('success', 'Berhasil menambahkan pkm');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function show($id)
    {
        $data = Pkm::findOrFail($id);
        $data->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        return Inertia::render('pkm/show', [
            'data' => $data,
            'role' => auth()->user()->role,
        ]);
    }

    public function edit($id)
    {
        $data = Pkm::findOrFail($id);
        $data->load('penulis', 'penulisLuar');
        $fakultas = Fakultas::get();
        return Inertia::render('pkm/edit', [
            'data' => $data,
            'fakultas' => $fakultas,
            'role' => auth()->user()->role,
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
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
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
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
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
            $pkm->penulisLuar()->delete();

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $pkm->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $pkm->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.pkm.index')->with('success', 'Berhasil memperbarui pkm');
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
            $data->penulisLuar()->delete();
            $data->delete();
            return back()->with('success', 'Berhasil menghapus pkm');
        } catch (\Throwable $th) {
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
