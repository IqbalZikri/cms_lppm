import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Award,
    BookOpen,
    CalendarDays,
    Clock,
    FileText,
    FlaskConical,
    Globe,
    HeartHandshake,
    Link2,
    Mail,
    MapPin,
    Users,
} from "lucide-react";
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { IMG, agenda, news, semesterChart, stats, tgl } from "@/lib/data";
import { btn, CountUp, Reveal, Section } from "@/components/public/ui";
import PublicAppLayout from "@/layouts/public/public-layout";

const icons = [FlaskConical, HeartHandshake, Award, BookOpen, FileText];

const kontak = {
    alamat: "Kampus Islamic Village, Universitas Cendekia Abditama (isi alamat lengkap dan kode pos)",
    email: "lppm@uca.ac.id",
    web: "lppm.uca.ac.id",
    jam: "Senin sampai Jumat, 08.00 sampai 16.00 WIB",
    mapsQuery: "Universitas Cendekia Abditama", // ganti dengan alamat lengkap agar titik peta akurat
};

const layanan = [
    {
        icon: FlaskConical,
        title: "Penelitian",
        text: "Hibah internal dan eksternal, pendampingan proposal, serta pemantauan kemajuan penelitian.",
        href: "/penelitian",
    },
    {
        icon: HeartHandshake,
        title: "Pengabdian Masyarakat",
        text: "Program PKM dan desa binaan yang berangkat dari kebutuhan warga.",
        href: "/berita",
    },
    {
        icon: Award,
        title: "Pengelolaan HKI",
        text: "Bantuan pendaftaran hak cipta, paten, dan kekayaan intelektual dosen.",
        href: "/publikasi",
    },
    {
        icon: BookOpen,
        title: "Publikasi Ilmiah",
        text: "Dukungan penerbitan di jurnal Scopus, SINTA, dan prosiding.",
        href: "/publikasi",
    },
    {
        icon: Users,
        title: "Pelatihan dan Klinik Proposal",
        text: "Workshop penulisan, klinik proposal, dan bimbingan menghadapi review.",
        href: "/layanan",
    },
    {
        icon: Link2,
        title: "Kerja Sama dan Kemitraan",
        text: "Jejaring riset dengan perguruan tinggi, pemerintah, dan industri.",
        href: "/kontak",
    },
];

export default function Beranda() {
    const [mode, setMode] = useState<"bar" | "line">("bar");
    const [first, ...rest] = news;
    return (
        <PublicAppLayout title="Beranda">
            <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-uca-deep">
  {/* foto digeser ke kanan: hanya menempati 70% lebar di layar besar */}
  <motion.img
    src={IMG.gerbang}
    alt="Gerbang Universitas Cendekia Abditama"
    initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: 'easeOut' }}
    className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[52%_50%] lg:w-[70%]"
  />
  {/* pudar dari hijau tua di kiri (tempat teks) ke foto di kanan */}
  <div className="absolute inset-0 -z-10 bg-uca-deep/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-uca-deep lg:from-[32%] lg:via-uca-deep/55 lg:via-[48%] lg:to-transparent" />

  <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-10">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
      <p className="mb-3 inline-block rounded-full bg-uca-gold px-4 py-1 text-sm font-bold text-uca-deep">Universitas Cendekia Abditama</p>
      <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl">Riset yang berguna, pengabdian yang terasa.</h1>
      <p className="mt-5 text-lg text-white/85">Lembaga Penelitian dan Pengabdian Masyarakat mendampingi dosen meneliti, menerbitkan karya, dan hadir bagi masyarakat.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/penelitian" className={btn + ' !bg-uca-gold !text-uca-deep hover:!bg-white'}>Lihat penelitian <ArrowRight size={18} /></Link>
        <Link href="/layanan" className="inline-flex items-center rounded-xl border-2 border-white/70 px-5 py-3 font-semibold text-white hover:bg-white/10">Cara mengajukan</Link>
      </div>
    </motion.div>
  </div>

  {/* statistik di dasar hero, tidak lagi menumpuk keluar */}
  <div className="mx-auto w-full max-w-6xl px-5 pb-6">
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-uca-gold/40 shadow-2xl md:grid-cols-5">
      {stats.map((s, i) => { const I = icons[i]; return (
        <div key={s.label} className="bg-white p-4">
          <I className="mb-1 text-uca-red" size={22} />
          <div className="font-display text-3xl font-bold text-uca-green"><CountUp to={s.value} /></div>
          <div className="text-sm font-semibold text-slate-600">{s.label}</div>
        </div>); })}
    </div>
  </div>
</section>

            <Section
                title="Perkembangan tiap semester"
                hint="Jumlah penelitian dan publikasi dosen UCA, dikelompokkan per semester."
            >
                <Reveal>
                    <div className="rounded-2xl bg-white p-5 shadow">
                        <div className="mb-4 flex gap-2" role="tablist">
                            {(
                                [
                                    ["bar", "Batang"],
                                    ["line", "Garis"],
                                ] as const
                            ).map(([k, l]) => (
                                <button
                                    key={k}
                                    role="tab"
                                    aria-selected={mode === k}
                                    onClick={() => setMode(k)}
                                    className={`rounded-lg px-4 py-2 font-semibold ${mode === k ? "bg-uca-green text-white" : "bg-uca-cream text-uca-green"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer>
                                {mode === "bar" ? (
                                    <BarChart data={semesterChart}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="semester"
                                            tick={{ fontSize: 13 }}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="penelitian"
                                            name="Penelitian"
                                            fill="#0B4A2C"
                                            radius={[6, 6, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="publikasi"
                                            name="Publikasi"
                                            fill="#C9A55C"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                ) : (
                                    <LineChart data={semesterChart}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="semester"
                                            tick={{ fontSize: 13 }}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            dataKey="penelitian"
                                            name="Penelitian"
                                            stroke="#0B4A2C"
                                            strokeWidth={3}
                                        />
                                        <Line
                                            dataKey="publikasi"
                                            name="Publikasi"
                                            stroke="#D32F43"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>
            </Section>

            <div className="bg-white">
                <Section
                    title="Layanan LPPM"
                    hint="Apa saja yang bisa dibantu LPPM untuk dosen dan mitra."
                >
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {layanan.map((l) => (
                            <Link
                                key={l.title}
                                href={l.href}
                                className="group rounded-2xl bg-uca-cream p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-uca-green text-uca-gold transition group-hover:bg-uca-red group-hover:text-white">
                                    <l.icon size={28} />
                                </span>
                                <h3 className="font-display text-xl font-bold text-uca-green">
                                    {l.title}
                                </h3>
                                <p className="mt-2 text-slate-600">{l.text}</p>
                            </Link>
                        ))}
                    </div>
                </Section>
            </div>

            <Section
                title="Berita terbaru"
                action={
                    <Link href="/berita" className="font-semibold text-uca-red">
                        Semua berita
                    </Link>
                }
            >
                <div className="grid gap-6 lg:grid-cols-5">
                    <Link
                        href={`/berita/${first.slug}`}
                        className="group relative overflow-hidden rounded-2xl lg:col-span-3"
                    >
                        <img
                            src={first.image}
                            alt=""
                            className="h-full min-h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-uca-deep via-uca-deep/50 to-transparent" />
                        <div className="absolute bottom-0 p-6 text-white">
                            <span className="rounded bg-uca-red px-2 py-1 text-xs font-bold">
                                {first.category}
                            </span>
                            <h3 className="font-display mt-2 text-2xl font-bold">
                                {first.title}
                            </h3>
                            <p className="mt-1 text-white/80">
                                {tgl(first.date)}
                            </p>
                        </div>
                    </Link>
                    <div className="space-y-4 lg:col-span-2">
                        {rest.slice(0, 3).map((n) => (
                            <Link
                                key={n.slug}
                                href={`/berita/${n.slug}`}
                                className="flex gap-4 rounded-2xl bg-white p-3 shadow transition hover:-translate-y-0.5"
                            >
                                <img
                                    src={n.image}
                                    alt=""
                                    className="h-24 w-28 shrink-0 rounded-xl object-cover"
                                />
                                <div>
                                    <span className="text-sm font-bold text-uca-red">
                                        {n.category}
                                    </span>
                                    <h3 className="font-semibold leading-snug text-uca-green">
                                        {n.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {tgl(n.date)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Section>

            <section className="bg-uca-cream">
                <div className="mx-auto max-w-6xl px-5 py-14">
                    <h2 className="font-display text-3xl font-bold text-uca-green">
                        Temukan kami
                    </h2>
                    <p className="mb-7 text-slate-600">
                        Datang langsung ke sekretariat LPPM atau hubungi lewat
                        kontak di bawah.
                    </p>
                    <div className="grid gap-6 lg:grid-cols-5">
                        <div className="space-y-4 lg:col-span-2">
                            {[
                                [MapPin, "Alamat", kontak.alamat],
                                [Mail, "Email", kontak.email],
                                [Globe, "Website", kontak.web],
                                [Clock, "Jam operasional", kontak.jam],
                            ].map(([I, t, v]: any) => (
                                <div
                                    key={t}
                                    className="flex gap-4 rounded-2xl border-l-8 border-uca-red bg-white p-5 shadow"
                                >
                                    <I className="mt-0.5 shrink-0 text-uca-red" />
                                    <div>
                                        <b className="text-uca-green">{t}</b>
                                        <p className="text-slate-700">{v}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="overflow-hidden rounded-2xl bg-white shadow-lg lg:col-span-3">
                            <iframe
                                title="Lokasi di Google Maps"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(kontak.mapsQuery)}&output=embed`}
                                className="h-80 w-full border-0 lg:h-[26rem]"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                                <span className="font-semibold text-uca-green">
                                    Universitas Cendekia Abditama
                                </span>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kontak.mapsQuery)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl bg-uca-green px-4 py-2 font-semibold text-white hover:bg-uca-deep"
                                >
                                    Buka di Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicAppLayout>
    );
}
