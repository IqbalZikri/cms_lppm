import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
    ArrowRight,
    BookOpen,
    Clock,
    FlaskConical,
    Handshake,
    HeartHandshake,
    MapPin,
    Newspaper,
    Sparkles,
} from "lucide-react";
import PublicAppLayout from "@/layouts/public/public-layout";
import TrenChart, { ChartPoint } from "@/components/tren-chart";
import { Berita } from "@/interface/berita";
import BeritaPlaceholder from "@/components/berita-placeholder";
import { formatTanggal } from "@/lib/format-tanggal";

type Props = {
    chart: ChartPoint[];
    stats: Stat[];
    berita: Berita[];
};

const ekosistem = [
    {
        icon: FlaskConical,
        judul: "Penelitian",
        teks: "Pendanaan, pendampingan proposal, dan tata kelola penelitian dosen.",
        href: "/penelitian",
    },
    {
        icon: BookOpen,
        judul: "Publikasi",
        teks: "Klinik naskah, repositori, serta dukungan jurnal dan kekayaan intelektual.",
        href: "/publikasi",
    },
    {
        icon: HeartHandshake,
        judul: "Pengabdian",
        teks: "Program berbasis kebutuhan untuk memberdayakan komunitas secara berkelanjutan.",
        href: "/berita",
    },
];

type Stat = { value: number; label: string };

function Hero({ stats }: { stats: Stat[] }) {
    return (
        <section className="relative isolate overflow-hidden bg-forest font-sans text-white">
            <motion.img
                src="/images/DSC06353.jpg"
                alt="Gedung Universitas Cendekia Abditama"
                className="absolute inset-0 -z-20 size-full object-cover object-center"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.4, ease: "easeOut" }}
            />

            {/* Overlay: hampir hitam di kiri, makin bening ke kanan */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(90deg, rgb(5 23 12 / 0.96) 0%, rgb(5 23 12 / 0.93) 22%, rgb(5 23 12 / 0.85) 39%, rgb(5 23 12 / 0.68) 59%, rgb(5 23 12 / 0.52) 78%, rgb(5 23 12 / 0.28) 100%)",
                }}
            />

            {/* Konten utama */}
            <div className="mx-auto max-w-7xl px-8 pt-[184px] pb-[108px]">
                <p className="text-[0.70rem] font-bold uppercase tracking-[0.18em] text-gold">
                    LPPM Universitas Cendekia Abditama
                </p>

                <h1 className="mt-3 font-display text-[80px] font-bold leading-[1.05] tracking-[-0.02em]">
                    Meneliti hari ini.
                    <br />
                    <span className="text-gold">Mengabdi</span> untuk esok.
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
                    Kami menumbuhkan riset yang relevan, inovasi yang dapat
                    diterapkan, dan pengabdian yang memperkuat masyarakat.
                </p>

                <div className="mt-8 flex gap-3">
                    <Link
                        href="/penelitian"
                        className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-gold px-6 text-sm font-medium text-ink transition-opacity hover:opacity-90"
                    >
                        Jelajahi Penelitian
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="/profil/visi-misi"
                        className="inline-flex h-12 items-center rounded-[3px] border border-white/35 px-8 text-sm font-medium transition-colors hover:bg-white/10"
                    >
                        Kenali LPPM
                    </Link>
                </div>
            </div>

            {/* Strip statistik */}
            <div className="border-t border-white/15 bg-forest/90">
                <dl className="mx-auto grid max-w-7xl grid-cols-2 px-8 md:grid-cols-4">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="flex flex-row-reverse items-baseline justify-end gap-2 border-white/15 px-4 py-5 md:border-l md:first:border-l-0"
                        >
                            <dt className="text-sm text-white/75">{s.label}</dt>
                            <dd className="font-display text-3xl font-bold text-gold">
                                {s.value}
                                <span className="text-xl">+</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

export default function Beranda({ chart, stats, berita }: Props) {
    return (
        <PublicAppLayout title="Riset, Inovasi & Pengabdian">
            <Hero stats={stats} />
            <section className="section-pad bg-heritage-pattern">
                <div className="page-shell grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="eyebrow text-primary">
                            Capaian Institusi
                        </p>
                        <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                            Pertumbuhan gagasan yang terukur
                        </h2>
                        <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                            Kinerja penelitian dan publikasi meningkat konsisten
                            setiap semester.
                        </p>
                    </div>
                </div>
                <div className="page-shell mt-[50px] border bg-[#ffff] p-5">
                    <TrenChart data={chart} />
                </div>
            </section>

            <section className="section-pad bg-surface">
                <div className="page-shell">
                    <p className="eyebrow text-primary">Ekosistem LPPM</p>
                    <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                        Dari ide menuju dampak nyata
                    </h2>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {ekosistem.map(({ icon: Icon, judul, teks, href }) => (
                            <article
                                key={judul}
                                className="lift-card flex flex-col rounded-lg border bg-card p-6"
                            >
                                <Icon className="size-8 text-primary" />
                                <h3 className="mt-5 font-display text-xl text-forest">
                                    {judul}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                                    {teks}
                                </p>
                                <Link
                                    href={href}
                                    className="mt-5 text-sm font-bold text-primary hover:text-amber"
                                >
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
                            <p className="eyebrow text-primary">
                                Kabar Terkini
                            </p>
                            <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                                Berita & cerita dampak
                            </h2>
                        </div>
                        <Link
                            href="/berita"
                            className="text-sm font-bold text-primary hover:text-amber"
                        >
                            Semua berita
                        </Link>
                    </div>

                    {berita && berita.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-3">
                            {berita.map((item, index) => {
                                const isLatest = index === 0;

                                /* ===== BERITA TERBARU (lengkap + ringkasan) ===== */
                                if (isLatest) {
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/berita/${item.slug}`}
                                            className="lift-card group grid overflow-hidden rounded-xl border bg-card md:col-span-3 md:grid-cols-2"
                                        >
                                            <div className="relative overflow-hidden">
                                                {item.gambar ? (
                                                    <img
                                                        src={item.gambar}
                                                        alt={item.judul_berita}
                                                        className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                                                    />
                                                ) : (
                                                    <BeritaPlaceholder
                                                        featured
                                                    />
                                                )}

                                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                                                    <Sparkles className="h-3.5 w-3.5" />
                                                    Terbaru
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-center p-6 md:p-10">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    <span className="text-primary">
                                                        {
                                                            item.kategori
                                                                ?.nama_kategori
                                                        }
                                                    </span>{" "}
                                                    &nbsp;
                                                    {formatTanggal(
                                                        item.published_at,
                                                    )}
                                                </p>
                                                <h3 className="mt-3 font-display text-3xl leading-tight text-forest group-hover:text-primary">
                                                    {item.judul_berita}
                                                </h3>
                                                <p className="mt-4 line-clamp-4 text-muted-foreground">
                                                    {item.ringkasan_berita}
                                                </p>
                                                <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
                                                    Baca selengkapnya
                                                    <span className="ml-1 transition-transform group-hover:translate-x-1">
                                                        →
                                                    </span>
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                }

                                /* ===== BERITA LAIN (ringkas) ===== */
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/berita/${item.slug}`}
                                        className="lift-card group overflow-hidden rounded-lg border bg-card"
                                    >
                                        <div className="overflow-hidden">
                                            {item.gambar ? (
                                                <img
                                                    src={item.gambar}
                                                    alt={item.judul_berita}
                                                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <BeritaPlaceholder />
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <p className="text-xs font-semibold text-muted-foreground">
                                                <span className="text-primary">
                                                    {
                                                        item.kategori
                                                            ?.nama_kategori
                                                    }
                                                </span>{" "}
                                                &nbsp;{item.published_at}
                                            </p>
                                            <h3 className="mt-2 line-clamp-2 font-display text-xl text-forest group-hover:text-primary">
                                                {item.judul_berita}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="relative isolate overflow-hidden bg-forest text-primary-foreground">
                <img
                    src="/images/gerbang.jpg"
                    alt="Gerbang Universitas Cendekia Abditama"
                    className="absolute inset-0 -z-20 size-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-forest/85" />
                <div className="page-shell section-pad">
                    <p className="eyebrow text-gold">Mari Berkolaborasi</p>
                    <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
                        Gagasan baik tumbuh lebih kuat saat dikerjakan bersama.
                    </h2>
                    <Link
                        href="/kontak"
                        className="mt-8 inline-block rounded-sm bg-gold px-6 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90"
                    >
                        Hubungi kami
                    </Link>
                </div>
            </section>
        </PublicAppLayout>
    );
}
