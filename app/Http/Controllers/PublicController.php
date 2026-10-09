<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function beranda(): Response
    {
        // Data contoh. Ganti dengan query Eloquent saat tabelnya siap.
        return Inertia::render('public/beranda', [
            'statistik' => [
                ['angka' => '148+', 'label' => 'Penelitian aktif'],
                ['angka' => '312+', 'label' => 'Publikasi ilmiah'],
                ['angka' => '46+', 'label' => 'Mitra kolaborasi'],
                ['angka' => '28+', 'label' => 'Program pengabdian'],
            ],
            'capaian' => [
                'periode' => ['2023 Gasal', '2023 Genap', '2024 Gasal', '2024 Genap', '2025 Gasal', '2025 Genap'],
                'penelitian' => [14, 19, 23, 28, 33, 38],
                'publikasi' => [31, 38, 47, 55, 63, 78],
            ],
            'berita' => [
                ['kategori' => 'Penelitian', 'tanggal' => '06 Oktober 2026', 'judul' => 'Hibah Penelitian Internal 2026 resmi dibuka', 'gambar' => '/images/gedung-uca.jpg', 'slug' => 'hibah-penelitian-internal-2026'],
                ['kategori' => 'Pengabdian', 'tanggal' => '30 September 2026', 'judul' => 'Dosen UCA dampingi UMKM menuju pemasaran digital', 'gambar' => '/images/gerbang-uca.jpg', 'slug' => 'dosen-uca-dampingi-umkm'],
                ['kategori' => 'Publikasi', 'tanggal' => '24 September 2026', 'judul' => 'Klinik artikel ilmiah: dari naskah menuju jurnal bereputasi', 'gambar' => '/images/kampus-uca.jpg', 'slug' => 'klinik-artikel-ilmiah'],
                ['kategori' => 'Kerja Sama', 'tanggal' => '18 September 2026', 'judul' => 'Kolaborasi riset lintas disiplin untuk kota berkelanjutan', 'gambar' => '/images/gedung-uca.jpg', 'slug' => 'kolaborasi-riset-kota-berkelanjutan'],
            ],
            'agenda' => [
                ['tanggal' => '12', 'bulan' => 'OKT', 'judul' => 'Workshop Proposal Hibah Eksternal', 'waktu' => '09.00 WIB', 'lokasi' => 'Kampus UCA'],
                ['tanggal' => '22', 'bulan' => 'OKT', 'judul' => 'Klinik Hak Kekayaan Intelektual', 'waktu' => '09.00 WIB', 'lokasi' => 'Kampus UCA'],
                ['tanggal' => '05', 'bulan' => 'NOV', 'judul' => 'Seminar Hasil Penelitian 2026', 'waktu' => '09.00 WIB', 'lokasi' => 'Kampus UCA'],
            ],
        ]);
    }

    public function halaman(string $slug): Response
    {
        $halaman = [
            'berita' => ['Berita & Agenda', 'Kabar terbaru, cerita dampak, dan agenda kegiatan LPPM.'],
            'penelitian' => ['Penelitian', 'Pendanaan, pendampingan proposal, dan tata kelola penelitian dosen.'],
            'publikasi' => ['Publikasi', 'Klinik naskah, repositori, serta dukungan jurnal dan kekayaan intelektual.'],
            'kontak' => ['Kontak', 'Hubungi sekretariat LPPM di lppm@uca.ac.id.'],
            'visi-misi' => ['Visi & Misi', 'Arah dan komitmen LPPM Universitas Cendekia Abditama.'],
            'struktur' => ['Struktur Kepengurusan', 'Susunan pengurus LPPM Universitas Cendekia Abditama.'],
            'sejarah' => ['Sejarah', 'Perjalanan LPPM Universitas Cendekia Abditama.'],
        ];

        abort_unless(isset($halaman[$slug]), 404);

        return Inertia::render('public/halaman', [
            'judul' => $halaman[$slug][0],
            'deskripsi' => $halaman[$slug][1],
        ]);
    }
}
