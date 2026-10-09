import { Link } from "@inertiajs/react";
import { useState } from "react";
import { BookOpen, Clock, FlaskConical, Handshake, HeartHandshake, MapPin } from "lucide-react";
import PublicAppLayout from "@/layouts/public/public-layout";

type Berita = { kategori: string; tanggal: string; judul: string; gambar: string; slug: string };
type Agenda = { tanggal: string; bulan: string; judul: string; waktu: string; lokasi: string };
type Capaian = { periode: string[]; penelitian: number[]; publikasi: number[] };
type Props = {
    statistik: { angka: string; label: string }[];
    capaian: Capaian;
    berita: Berita[];
    agenda: Agenda[];
};

const ekosistem = [
    { icon: FlaskConical, judul: "Penelitian", teks: "Pendanaan, pendampingan proposal, dan tata kelola penelitian dosen.", href: "/penelitian" },
    { icon: BookOpen, judul: "Publikasi", teks: "Klinik naskah, repositori, serta dukungan jurnal dan kekayaan intelektual.", href: "/publikasi" },
    { icon: HeartHandshake, judul: "Pengabdian", teks: "Program berbasis kebutuhan untuk memberdayakan komunitas secara berkelanjutan.", href: "/berita" },
    { icon: Handshake, judul: "Kolaborasi", teks: "Ruang temu peneliti, dunia usaha, pemerintah, dan masyarakat.", href: "/kontak" },
];

function GrafikCapaian({ data }: { data: Capaian }) {
    const [seri, setSeri] = useState<"penelitian" | "publikasi">("penelitian");
    const nilai = data[seri];
    const maks = Math.max(...nilai);

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex gap-2" role="tablist" aria-label="Pilih data grafik">
                {(["penelitian", "publikasi"] as const).map((s) => (
                    <button
                        key={s}
                        role="tab"
                        aria-selected={seri === s}
                        onClick={() => setSeri(s)}
                        className={`rounded-sm px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                            seri === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <div className="mt-8 flex items-end gap-3">
                {nilai.map((n, i) => (
                    <div key={data.periode[i]} className="flex flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-xs font-semibold">{n}</span>
                        <div
                            className="w-full rounded-t-sm bg-primary transition-[height] duration-500"
                            style={{ height: `${(n / maks) * 180}px` }}
                        />
                        <span className="text-center text-[11px] leading-tight text-muted-foreground">{data.periode[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Beranda({ statistik, capaian, berita, agenda }: Props) {
    const [utama, ...lainnya] = berita;

    return (
        <PublicAppLayout title="Riset, Inovasi & Pengabdian">
            <section className="relative isolate overflow-hidden bg-forest text-primary-foreground">
                <img
                    src="/images/gedung-uca.jpg"
                    alt="Gedung Universitas Cendekia Abditama"
                    className="hero-photo absolute inset-0 -z-20 size-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-forest/95 via-forest/75 to-forest/30" />
                <div className="page-shell pt-20 pb-12 md:pt-32">
                    <p className="eyebrow text-gold">LPPM Universitas Cendekia Abditama</p>
                    <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
                        Meneliti hari ini.
                        <br />
                        Mengabdi untuk esok.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                        Kami menumbuhkan riset yang relevan, inovasi yang dapat diterapkan, dan pengabdian yang memperkuat masyarakat.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/penelitian" className="rounded-sm bg-gold px-6 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90">
                            Jelajahi Penelitian
                        </Link>
                        <Link href="/profil/visi-misi" className="rounded-sm border border-primary-foreground/40 px-6 py-3 text-sm font-bold transition-colors hover:bg-primary-foreground/10">
                            Kenali LPPM
                        </Link>
                    </div>
                    <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-primary-foreground/20 pt-8 md:grid-cols-4">
                        {statistik.map((s) => (
                            <div key={s.label}>
                                <dd className="font-display text-4xl text-gold md:text-5xl">{s.angka}</dd>
                                <dt className="mt-1 text-sm text-primary-foreground/70">{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="section-pad bg-heritage-pattern">
                <div className="page-shell grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="eyebrow text-primary">Capaian Institusi</p>
                        <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">Pertumbuhan gagasan yang terukur</h2>
                        <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                            Kinerja penelitian dan publikasi meningkat konsisten setiap semester, didukung kolaborasi lintas program studi dan mitra.
                        </p>
                    </div>
                    <GrafikCapaian data={capaian} />
                </div>
            </section>

            <section className="section-pad bg-surface">
                <div className="page-shell">
                    <p className="eyebrow text-primary">Ekosistem LPPM</p>
                    <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">Dari ide menuju dampak nyata</h2>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {ekosistem.map(({ icon: Icon, judul, teks, href }) => (
                            <article key={judul} className="lift-card flex flex-col rounded-lg border bg-card p-6">
                                <Icon className="size-8 text-primary" />
                                <h3 className="mt-5 font-display text-xl text-forest">{judul}</h3>
                                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{teks}</p>
                                <Link href={href} className="mt-5 text-sm font-bold text-primary hover:text-amber">
                                    Selengkapnya
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-pad">
                <div className="page-shell">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="eyebrow text-primary">Kabar Terkini</p>
                            <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">Berita & cerita dampak</h2>
                        </div>
                        <Link href="/berita" className="text-sm font-bold text-primary hover:text-amber">
                            Semua berita
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
                        <div className="grid gap-6 md:grid-cols-2">
                            {utama && (
                                <Link href="/berita" className="lift-card group overflow-hidden rounded-lg border bg-card md:col-span-2">
                                    <img src={utama.gambar} alt="" className="h-64 w-full object-cover" />
                                    <div className="p-6">
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            <span className="text-primary">{utama.kategori}</span> &nbsp;{utama.tanggal}
                                        </p>
                                        <h3 className="mt-2 font-display text-2xl text-forest group-hover:text-primary">{utama.judul}</h3>
                                    </div>
                                </Link>
                            )}
                            {lainnya.map((b) => (
                                <Link key={b.slug} href="/berita" className="lift-card group overflow-hidden rounded-lg border bg-card">
                                    <img src={b.gambar} alt="" className="h-40 w-full object-cover" />
                                    <div className="p-5">
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            <span className="text-primary">{b.kategori}</span> &nbsp;{b.tanggal}
                                        </p>
                                        <h3 className="mt-2 font-display text-lg leading-snug text-forest group-hover:text-primary">{b.judul}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <aside>
                            <h3 className="font-display text-2xl text-forest">Agenda terdekat</h3>
                            <ul className="mt-5 divide-y border-y">
                                {agenda.map((a) => (
                                    <li key={a.judul} className="flex gap-4 py-5">
                                        <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-sm bg-forest text-primary-foreground">
                                            <strong className="font-display text-2xl leading-none">{a.tanggal}</strong>
                                            <span className="mt-1 text-[10px] font-bold tracking-widest text-gold">{a.bulan}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-display text-lg leading-snug text-forest">{a.judul}</h4>
                                            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="size-3.5" />{a.waktu}</span>
                                                <span className="flex items-center gap-1"><MapPin className="size-3.5" />{a.lokasi}</span>
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/berita" className="mt-5 inline-block text-sm font-bold text-primary hover:text-amber">
                                Lihat seluruh agenda
                            </Link>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="relative isolate overflow-hidden bg-forest text-primary-foreground">
                <img src="/images/gerbang-uca.jpg" alt="Gerbang Universitas Cendekia Abditama" className="absolute inset-0 -z-20 size-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-forest/85" />
                <div className="page-shell section-pad">
                    <p className="eyebrow text-gold">Mari Berkolaborasi</p>
                    <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
                        Gagasan baik tumbuh lebih kuat saat dikerjakan bersama.
                    </h2>
                    <Link href="/kontak" className="mt-8 inline-block rounded-sm bg-gold px-6 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90">
                        Hubungi kami
                    </Link>
                </div>
            </section>
        </PublicAppLayout>
    );
}
