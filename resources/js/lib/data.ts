// Data contoh. Ganti dengan props dari controller Laravel (Inertia::render) saat database siap.
export type News = { slug: string; title: string; excerpt: string; category: string; date: string; image: string; body: string[] };
export type Research = { id: number; title: string; leader: string; faculty: string; semester: 'Ganjil' | 'Genap'; year: number; source: 'Internal' | 'Eksternal'; amount: number };
export type Publication = { id: number; title: string; authors: string; venue: string; type: 'Scopus' | 'SINTA' | 'Prosiding' | 'HKI'; year: number; link: string };

export const IMG = { gerbang: '/images/gerbang.jpg', gedung: '/images/gedung.jpg', kampus: '/images/kampus.jpg', logo: '/images/logo_uca.jpg' };

export const stats = [
  { label: 'Penelitian', value: 128 }, { label: 'Pengabdian (PKM)', value: 94 },
  { label: 'HKI terdaftar', value: 37 }, { label: 'Artikel jurnal', value: 156 }, { label: 'Prosiding', value: 63 },
];

export const semesterChart = [
  { semester: '2023 Ganjil', penelitian: 14, publikasi: 18 }, { semester: '2023 Genap', penelitian: 18, publikasi: 22 },
  { semester: '2024 Ganjil', penelitian: 21, publikasi: 27 }, { semester: '2024 Genap', penelitian: 25, publikasi: 34 },
  { semester: '2025 Ganjil', penelitian: 24, publikasi: 38 }, { semester: '2025 Genap', penelitian: 26, publikasi: 41 },
];

const lorem = ['Kegiatan ini diikuti oleh dosen dan peneliti dari berbagai fakultas di lingkungan Universitas Cendekia Abditama.', 'Ketua LPPM menyampaikan bahwa penguatan budaya riset menjadi prioritas agar hasil penelitian dapat dirasakan langsung oleh masyarakat.', 'Informasi lebih lanjut dapat diperoleh melalui sekretariat LPPM atau halaman Layanan di situs ini.'];
export const news: News[] = [
  { slug: 'workshop-penulisan-jurnal-scopus', title: 'Workshop penulisan artikel jurnal terindeks Scopus', excerpt: 'Dosen berlatih menyusun naskah, memilih jurnal target, dan menghadapi proses review.', category: 'Pelatihan', date: '2026-09-28', image: IMG.gedung, body: lorem },
  { slug: 'pendanaan-penelitian-internal-2026', title: 'Pendanaan penelitian internal 2026 dibuka', excerpt: 'Proposal diterima hingga akhir bulan melalui portal dosen. Cek skema dan ketentuannya.', category: 'Pengumuman', date: '2026-09-20', image: IMG.gerbang, body: lorem },
  { slug: 'pkm-desa-binaan', title: 'Tim PKM UCA dampingi desa binaan kelola sampah', excerpt: 'Pelatihan pemilahan dan bank sampah melibatkan puluhan warga dan mahasiswa.', category: 'Pengabdian', date: '2026-09-12', image: IMG.kampus, body: lorem },
  { slug: 'hki-dosen-bertambah', title: 'Sebelas HKI dosen UCA terbit semester ini', excerpt: 'Karya berupa buku, modul ajar, dan perangkat lunak resmi tercatat.', category: 'HKI', date: '2026-08-30', image: IMG.gedung, body: lorem },
  { slug: 'seminar-nasional-2026', title: 'Seminar nasional: riset untuk pembangunan berkelanjutan', excerpt: 'Pembicara tamu dan peserta dari belasan perguruan tinggi hadir di Kampus Islamic Village.', category: 'Seminar', date: '2026-08-14', image: IMG.kampus, body: lorem },
  { slug: 'kerja-sama-mitra-riset', title: 'LPPM jalin kerja sama riset dengan mitra industri', excerpt: 'Naskah kerja sama membuka peluang penelitian terapan dan magang riset mahasiswa.', category: 'Kerja sama', date: '2026-07-29', image: IMG.gerbang, body: lorem },
];
export const categories = ['Semua', ...Array.from(new Set(news.map(n => n.category)))];

const fac = ['FTIK', 'Ekonomi dan Bisnis', 'Hukum', 'Kesehatan', 'Teknik'];
const names = ['Dr. Ahmad Fauzi, M.Kom.', 'Siti Rahmawati, M.Pd.', 'Dr. Budi Santoso, M.T.', 'Nur Hidayah, M.Si.', 'Rizky Pratama, M.M.', 'Dewi Lestari, M.Kes.'];
export const researches: Research[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: ['Pengembangan sistem informasi akademik berbasis web', 'Analisis literasi digital mahasiswa', 'Model pembelajaran daring adaptif', 'Pengaruh kepemimpinan terhadap kinerja dosen', 'Pemanfaatan energi surya skala rumah tangga', 'Perlindungan data pribadi pada layanan kampus'][i % 6] + (i > 5 ? ` (tahap ${Math.floor(i / 6) + 1})` : ''),
  leader: names[i % 6], faculty: fac[i % 5], semester: i % 2 ? 'Genap' : 'Ganjil', year: 2023 + (i % 3),
  source: i % 3 === 0 ? 'Eksternal' : 'Internal', amount: (8 + (i % 5) * 4) * 1_000_000,
}));
export const publications: Publication[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: ['Machine learning untuk prediksi kelulusan tepat waktu', 'Peran literasi keuangan pada UMKM', 'Efektivitas pembelajaran berbasis proyek', 'Kajian hukum transaksi elektronik', 'Optimasi jaringan sensor nirkabel', 'Strategi komunikasi kesehatan masyarakat'][i % 6],
  authors: names[i % 6] + ', ' + names[(i + 2) % 6], venue: ['Jurnal Teknologi Informasi', 'Indonesian Journal of Education', 'Jurnal Ekonomi dan Bisnis', 'Prosiding SNATI', 'Jurnal Hukum Digital'][i % 5],
  type: (['Scopus', 'SINTA', 'Prosiding', 'HKI'] as const)[i % 4], year: 2023 + (i % 3), link: '#',
}));

export const agenda = [
  { date: '15 Okt 2026', title: 'Batas unggah proposal penelitian internal' },
  { date: '22 Okt 2026', title: 'Klinik proposal hibah eksternal' },
  { date: '05 Nov 2026', title: 'Seminar hasil pengabdian masyarakat' },
];
export const downloads = [
  { title: 'Panduan penelitian dan pengabdian', size: 'PDF, 2,1 MB' }, { title: 'Template proposal penelitian', size: 'DOCX, 180 KB' },
  { title: 'Template laporan kemajuan dan akhir', size: 'DOCX, 160 KB' }, { title: 'Formulir pengajuan HKI', size: 'PDF, 320 KB' },
  { title: 'Peta jalan penelitian UCA', size: 'PDF, 1,4 MB' }, { title: 'Kode etik penelitian', size: 'PDF, 540 KB' },
];
export const faqs = [
  ['Siapa yang boleh mengajukan penelitian?', 'Dosen tetap UCA yang sudah memiliki akun di portal dosen. Daftar dulu jika belum punya akun.'],
  ['Kapan proposal diterima?', 'Setiap semester. Jadwal tertera pada agenda di Beranda dan pada pengumuman.'],
  ['Bagaimana mengajukan HKI?', 'Unggah karya dan formulir lewat portal dosen. Tim LPPM akan membantu sampai sertifikat terbit.'],
  ['Ke mana melapor jika ada kendala?', 'Hubungi sekretariat LPPM lewat halaman Kontak.'],
];
export const misi = ['Menyelenggarakan penelitian yang unggul, bermutu, dan bermanfaat bagi masyarakat.', 'Mendorong publikasi ilmiah dan perlindungan kekayaan intelektual dosen.', 'Melaksanakan pengabdian kepada masyarakat yang berkelanjutan dan berbasis kebutuhan nyata.', 'Membangun jejaring kerja sama riset dengan perguruan tinggi, pemerintah, dan industri.', 'Menumbuhkan budaya riset yang berlandaskan nilai-nilai Islami dan etika akademik.'];
export const struktur = [
  { role: 'Ketua LPPM', name: 'Nama Ketua, M.Si.' }, { role: 'Sekretaris', name: 'Nama Sekretaris, M.Pd.' },
  { role: 'Kepala Pusat Penelitian', name: 'Nama, M.T.' }, { role: 'Kepala Pusat Pengabdian Masyarakat', name: 'Nama, M.Sos.' },
  { role: 'Kepala Pusat Publikasi dan HKI', name: 'Nama, M.Kom.' }, { role: 'Staf administrasi', name: 'Nama Staf, S.E.' },
];
export const sejarah = [
  ['Tahap awal', 'Universitas Cendekia Abditama berdiri dengan semangat kampus Islamic Village.'], ['Unit riset', 'Unit penelitian dan pengabdian dibentuk di bawah pimpinan universitas.'],
  ['LPPM', 'Unit berkembang menjadi Lembaga Penelitian dan Pengabdian Masyarakat.'], ['Digitalisasi', 'Portal dosen dan sistem pelaporan daring mulai digunakan.'],
  ['Kini', 'Situs publik LPPM dibuka agar hasil riset mudah diakses masyarakat.'],
];
export const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
export const tgl = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
