<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\LuaranBuku;
use App\Models\Penulis;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class LuaranBukuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexAdmin(Request $request)
    {
        $luaranBukuQuery = LuaranBuku::query()->with("penulis.fakultas", "penulis.dosen");

        if ($request->filled("cari_fakultas")) {
            $luaranBukuQuery->whereHas("penulis", function ($q) use ($request) {
                $q->where('fakultas_id', $request->cari_fakultas);
            });
        }

        $data = $luaranBukuQuery->clone()->search($request->query("search"))->latest()->paginate(10)->withQueryString();
        $fakultas = Fakultas::select("id", "nama_fakultas")->get();

        $totalLuaranBuku = LuaranBuku::count();
        $counts = Penulis::where("penulisable_type", Penulis::class)
            ->selectRaw("fakultas_id, count(*) as total")
            ->groupBy("fakultas_id")
            ->pluck("total", "fakultas_id");

        $totalLuaranBukuPerFakultas = $fakultas->map(fn($f) => [
            'label' => $f->nama_fakultas,
            'count' => $counts[$f->id] ?? 0
        ]);

        Log::info($totalLuaranBukuPerFakultas);

        return Inertia::render('admin/luaran-buku/index', [
            "data" => $data,
            "fakultas" => $fakultas,
            "filters" => $request->only("search", "cari_fakultas"),
            "totalLuaranBuku" => $totalLuaranBuku,
            "totalLuaranBukuPerFakultas" => $totalLuaranBukuPerFakultas
        ]);

    }

    public function indexUppm(Request $request)
    {
        $data = LuaranBuku::whereHas('penulis', function ($query) {
            $query->where("penulis", auth()->user()->fakultas_id);
        })->search($request->query("search"))->with("penulis.fakultas", "penulis.dosen")->latest()->paginate(10)->withQueryString();


        return Inertia::render('uppm/luaran-buku/index', [
            "data" => $data,
            "filters" => $request->only("search")
        ]);
    }

    public function indexDosen(Request $request)
    {
        $dosen = Dosen::where("user_id", auth()->user()->id)->first();
        $data = LuaranBuku::whereHas("penulis", function ($query) use ($dosen) {
            $query->where("dosen_id", $dosen->id);
        })->with("penulis.fakultas", "penulis.dosen")->search($request->query("search"))->latest()->paginate(10)->withQueryString();

        return Inertia::render("dosen/luaran-buku/index", [
            "data" => $data,
            "filters" => $request->only("search")
        ]);
    }

    public function create()
    {
        $fakultas = Fakultas::select("id", "nama_fakultas")->get();
        $role = auth()->user()->role;

        return Inertia::render("luaran-buku/create", [
            "fakultas" => $fakultas,
            "role" => $role
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'isbn' => 'required|string',
            'tahun' => 'required|integer',
            'link_berkas' => 'required|url',
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'isbn.required' => 'Silahkan isi ISBN',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $data = LuaranBuku::create([
                'judul' => $validated['judul'],
                'isbn' => $validated['isbn'],
                'tahun' => $validated['tahun'],
                'link_berkas' => $validated['link_berkas'],
            ]);

            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $data->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $data->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()
                ->route(auth()->user()->role . '.luaran_buku.index')
                ->with('success', 'Berhasil menambahkan luaran buku');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LuaranBuku $luaranBuku)
    {
        $role = auth()->user()->role;
        $luaranBuku->load("penulis.fakultas", "penulis.dosen", "penulisLuar");
        return Inertia::render("luaran-buku/show", [
            "role" => $role,
            "data" => $luaranBuku,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LuaranBuku $luaranBuku)
    {
        $luaranBuku->load("penulis.fakultas", "penulis.dosen", "penulisLuar");
        $role = auth()->user()->role;
        $fakultas = Fakultas::select("id", "nama_fakultas")->get();
        return Inertia::render("luaran-buku/edit", [
            "data" => $luaranBuku,
            "role" => $role,
            "fakultas" => $fakultas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LuaranBuku $luaranBuku)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'isbn' => 'required|string',
            'tahun' => 'required|integer',
            'link_berkas' => 'required|url',
            'authors' => 'required|array|min:1',
            'authors.*.tipe' => 'required|in:internal,luar',

            // internal
            'authors.*.fakultas_id' => 'required_if:authors.*.tipe,internal|nullable|exists:fakultas,id',
            'authors.*.dosen_id' => 'required_if:authors.*.tipe,internal|nullable|exists:dosens,id',

            // luar universitas
            'authors.*.nama_universitas' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
            'authors.*.nama_dosen' => 'required_if:authors.*.tipe,luar|nullable|string|max:255',
        ], [
            'judul.required' => 'Silahkan isi judul',
            'isbn.required' => 'Silahkan isi ISBN',
            'tahun.required' => 'Silahkan isi tahun',
            'link_berkas.required' => 'Silahkan isi link berkas',
            'authors.required' => 'Silahkan tambahkan minimal satu penulis',
            'authors.*.fakultas_id.required_if' => 'Silahkan pilih fakultas',
            'authors.*.dosen_id.required_if' => 'Silahkan pilih dosen',
            'authors.*.nama_universitas.required_if' => 'Silahkan isi nama universitas',
            'authors.*.nama_dosen.required_if' => 'Silahkan isi nama dosen',
        ]);

        DB::beginTransaction();

        try {
            $luaranBuku->update([
                "judul" => $validated["judul"],
                "isbn" => $validated["isbn"],
                "tahun" => $validated["tahun"],
                "link_berkas" => $validated["link_berkas"],
            ]);

            $luaranBuku->penulis()->delete();
            $luaranBuku->penulisLuar()->delete();
            foreach ($validated['authors'] as $i => $author) {
                if ($author['tipe'] === 'internal') {
                    $luaranBuku->penulis()->create([
                        'fakultas_id' => $author['fakultas_id'],
                        'dosen_id' => $author['dosen_id'],
                        'urutan' => $i + 1,
                    ]);
                } else {
                    $luaranBuku->penulisLuar()->create([
                        'nama_universitas' => $author['nama_universitas'],
                        'nama_dosen' => $author['nama_dosen'],
                        'urutan' => $i + 1,
                    ]);
                }
            }

            DB::commit();

            $role = auth()->user()->role;

            return redirect()->route($role . ".luaran_buku.index")->with("success", "Berhasil mengedit luaran buku");
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LuaranBuku $luaranBuku)
    {
        DB::beginTransaction();
        try {
            $luaranBuku->penulis()->delete();
            $luaranBuku->penulisLuar()->delete();
            $luaranBuku->delete();

            DB::commit();

            $role = auth()->user()->role;

            return redirect()->route($role . ".luaran_buku.index")->with("success", "Berhasil menghapus luaran buku");
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th->getMessage(), ['trace' => $th->getTraceAsString()]);
            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
