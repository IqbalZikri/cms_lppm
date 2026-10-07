<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranJurnal;
use App\Models\Penulis;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranJurnalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexAdmin(Request $request)
    {
        $queryLuaranJurnal = LuaranJurnal::query()->with('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        if ($request->filled('cari_fakultas')) {
            $queryLuaranJurnal->whereHas('penulis', function ($q) use ($request) {
                $q->where('fakultas_id', $request->cari_fakultas);
            });
        }
        $data = $queryLuaranJurnal->clone()->latest()->search($request->query("search"))->paginate(10)->withQueryString();
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $totalLuaranJurnal = LuaranJurnal::count();
        $counts = Penulis::where('penulisable_type', LuaranJurnal::class)
            ->selectRaw('fakultas_id, count(*) as total')
            ->groupBy('fakultas_id')
            ->pluck('total', 'fakultas_id');

        $totalLuaranJurnalPerFakultas = $fakultas->map(fn($f) => [
            'label' => $f->nama_fakultas,
            'count' => $counts[$f->id] ?? 0,
        ])->values();

        return Inertia::render('admin/luaran-jurnal/index', [
            'data' => $data,
            'fakultas' => $fakultas,
            "totalLuaranJurnal" => $totalLuaranJurnal,
            "totalLuaranJurnalPerFakultas" => $totalLuaranJurnalPerFakultas,
            "filters" => $request->only("search", "cari_fakultas")
        ]);
    }

    public function indexDosen(Request $request)
    {
        $dosen = Dosen::where('user_id', auth()->user()->id)->with('penulis', 'fakultas')->first();
        $data = LuaranJurnal::whereHas('penulis', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10);
        return Inertia::render('dosen/luaran-jurnal/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    public function indexUppm(Request $request)
    {
        $data = LuaranJurnal::whereHas('penulis', function ($query) {
            $query->where('fakultas_id', auth()->user()->fakultas_id);
        })->search($request->query("search"))->with('penulis.fakultas', 'penulis.dosen')->latest()->paginate(10)->withQueryString();
        return Inertia::render('uppm/luaran-jurnal/index', [
            'data' => $data,
            'filters' => $request->only("search"),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $role = auth()->user()->role;
        return Inertia::render('luaran-jurnal/create', [
            'fakultas' => $fakultas,
            'role' => $role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_luaran_jurnal' => "required",
            'judul' => "required",
            'abstrak' => "required",
            'semester' => "required",
            'tahun' => "required",
            'link_berkas' => "required",
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            "jenis_luaran_jurnal.required" => "Silahkan isi luaran jurnal",
            "judul.required" => "Silahkan isi judul",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranJurnal = LuaranJurnal::create([
                'jenis_luaran_jurnal' => $validated['jenis_luaran_jurnal'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $luaranJurnal->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $luaranJurnal->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.luaran_jurnal.index')->with('success', 'Berhasil menambahkan luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LuaranJurnal $luaranJurnal)
    {
        $luaranJurnal->load('penulis.fakultas', 'penulis.dosen', 'penulisLuar');
        return Inertia::render('luaran-jurnal/show', [
            'data' => $luaranJurnal,
            'role' => auth()->user()->role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranJurnal $luaranJurnal)
    {
        $fakultas = Fakultas::select('id', 'nama_fakultas')->get();
        $luaranJurnal->load('penulis', 'penulisLuar');
        return Inertia::render('luaran-jurnal/edit', [
            'fakultas' => $fakultas,
            'data' => $luaranJurnal,
            'role' => auth()->user()->role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LuaranJurnal $luaranJurnal)
    {
        $validated = $request->validate([
            'jenis_luaran_jurnal' => "required",
            'judul' => "required",
            'abstrak' => "required",
            'semester' => "required",
            'tahun' => "required",
            'link_berkas' => "required",
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            "jenis_luaran_jurnal.required" => "Silahkan isi luaran jurnal",
            "judul.required" => "Silahkan isi judul",
            "abstrak.required" => "Silahkan isi abstrak",
            "semester.required" => "Silahkan isi semester",
            "tahun.required" => "Silahkan isi tahun",
            "link_berkas.required" => "Silahkan isi link berkas",
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranJurnal->update([
                'jenis_luaran_jurnal' => $validated['jenis_luaran_jurnal'],
                'judul' => $validated['judul'],
                'abstrak' => $validated['abstrak'],
                'semester' => $validated['semester'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            $luaranJurnal->penulis()->delete();
            $luaranJurnal->penulisLuar()->delete();

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $luaranJurnal->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $luaranJurnal->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route(auth()->user()->role . '.luaran_jurnal.index')->with('success', 'Berhasil mengedit luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LuaranJurnal $luaranJurnal)
    {
        try {
            $luaranJurnal->penulis()->delete();
            $luaranJurnal->penulisLuar()->delete();
            $luaranJurnal->delete();
            return back()->with('success', 'Berhasil menghapus data luaran jurnal');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), [$th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
