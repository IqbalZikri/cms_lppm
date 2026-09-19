<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Storage;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $data = Berita::with('kategori')->latest()->paginate(10);
        $kategori = Kategori::get();
        $beritaDraft = Berita::where('status_published', 'draft')->count();
        $beritaPublished = Berita::where('status_published', 'published')->count();
        $beritaArchived = Berita::where('status_published', 'archived')->count();

        return Inertia::render('admin/berita/index', [
            'data' => $data,
            'kategori' => $kategori,
            'beritaDraft' => $beritaDraft,
            'beritaPublished' => $beritaPublished,
            'beritaArchived' => $beritaArchived,
        ]);
    }

    public function create()
    {
        $kategoris = Kategori::get();

        return Inertia::render('admin/berita/create', [
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required',
            'judul_berita' => 'required',
            'ringkasan_berita' => 'required',
            'isi_berita' => 'required',
            'gambar' => 'nullable|mimes:png,jpg,jpeg|max:2048',
            'status_published' => 'required',
            'slug' => 'required',
        ], [
            'kategori_id.required' => 'Pilih salah satu kategori',
            'judul_berita.required' => 'Judul berita wajib diisi',
            'ringkasan_berita.required' => 'Ringkasan berita wajib diisi',
            'isi_berita.required' => 'Isi berita wajib diisi',
            'gambar.mimes' => 'Format yang didukung png, jpg, jpeg',
        ]);

        try {
            if ($request->hasFile('gambar')) {
                $gambar = $request->file('gambar')->store('berita', 'public');
            }

            Berita::create([
                'kategori_id' => $request->kategori_id,
                'judul_berita' => $request->judul_berita,
                'ringkasan_berita' => $request->ringkasan_berita,
                'isi_berita' => $request->isi_berita,
                'views' => 0,
                'gambar' => $gambar ?? null,
                'status_published' => $request->status_published,
                'slug' => $request->slug,
                'user_id' => auth()->user()->id,
            ]);

            return redirect()->route('admin.berita.index')->with('success', 'Berhasil membuat berita baru');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function updateStatus(Berita $berita)
    {
        try {
            if ($berita->status_published === 'draft') {
                $berita->update([
                    'status_published' => 'published',
                    'published_at' => now(),
                ]);
            } else {
                $berita->update([
                    'status_published' => 'draft',
                    'published_at' => null,
                ]);
            }

            return back()->with('success', 'Berhasil mengedit status berita');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function show(Berita $berita)
    {
        $berita->load('kategori', 'user');

        return Inertia::render('admin/berita/show', [
            'berita' => [
                ...$berita->toArray(),
                'gambar' => $berita->gambar
                    ? Storage::url($berita->gambar)
                    : null,
            ],
        ]);
    }

    public function edit(Berita $berita)
    {
        $kategoris = Kategori::get();

        return Inertia::render('admin/berita/edit', [
            'berita' => [
                ...$berita->toArray(),
                'gambar' => $berita->gambar
                    ? Storage::url($berita->gambar)
                    : null,
            ],
            'kategoris' => $kategoris,
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'kategori_id' => 'required',
            'judul_berita' => 'required',
            'ringkasan_berita' => 'required',
            'isi_berita' => 'required',
            'gambar' => 'nullable|mimes:png,jpg,jpeg|max:2048',
            'status_published' => 'required',
            'slug' => 'required',
        ], [
            'kategori_id.required' => 'Pilih salah satu kategori',
            'judul_berita.required' => 'Judul berita wajib diisi',
            'ringkasan_berita.required' => 'Ringkasan berita wajib diisi',
            'isi_berita.required' => 'Isi berita wajib diisi',
            'gambar.max' => 'Maksimal ukuran file 2MB',
            'gambar.mimes' => 'Format yang didukung png, jpg, jpeg',
        ]);

        try {
            $gambarBaru = null;
            if ($request->hasFile('gambar')) {
                $gambar = $request->file('gambar')->store('berita', 'public');
                $gambarBaru = $gambar;
            } else {
                $gambarBaru = $berita->gambar;
            }

            $berita->update([
                'kategori_id' => $request->kategori_id,
                'judul_berita' => $request->judul_berita,
                'ringkasan_berita' => $request->ringkasan_berita,
                'isi_berita' => $request->isi_berita,
                'views' => 0,
                'gambar' => $gambarBaru ?? null,
                'status_published' => $request->status_published,
                'slug' => $request->slug,
                'user_id' => auth()->user()->id,
            ]);

            return redirect()->route('admin.berita.index')->with('success', 'Berhasil mengedit berita');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }

    public function destroy(Berita $berita)
    {
        try {
            $berita->delete();

            return back()->with('success', 'Berhasil hapus berita');
        } catch (\Throwable $th) {
            Log::info($th->getMessage());

            return back()->with('error', 'Terjadi Kesalahan');
        }
    }
}
