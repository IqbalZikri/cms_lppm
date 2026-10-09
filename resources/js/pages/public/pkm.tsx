import { Link, router } from "@inertiajs/react";
import { motion } from "motion/react";
import { HeartHandshake, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import PublicAppLayout from "@/layouts/public/public-layout";

type PageLink = { url: string | null; label: string; active: boolean };
type Item = {
    id: number;
    judul: string;
    tahun: string | number;
    semester: string | null;
    jenis: string | null;
    penulis: { nama: string; afiliasi: string | null }[];
};
type Filters = { q?: string; jenis?: string; tahun?: string };

interface Props {
    pkm: { data: Item[]; links: PageLink[]; total: number };
    grafik: { tahun: string; total: number }[];
    daftarTahun: (string | number)[];
    daftarJenis: string[];
    filters: Filters;
}

const labelHalaman = (l: string) =>
    l.includes("Previous")
        ? "Sebelumnya"
        : l.includes("Next")
          ? "Berikutnya"
          : l;

function Grafik({ data }: { data: Props["grafik"] }) {
    const maks = Math.max(1, ...data.map((d) => d.total));

    return (
        <div className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-xl text-forest">
                Jumlah kegiatan per tahun
            </h2>
            <div className="mt-8 flex items-end gap-4">
                {data.map((d) => (
                    <div
                        key={d.tahun}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <span className="text-xs font-semibold">{d.total}</span>
                        <div
                            className="w-full max-w-12 rounded-t-sm bg-primary transition-[height] duration-500"
                            style={{
                                height: `${Math.max(d.total > 0 ? 6 : 0, (d.total / maks) * 160)}px`,
                            }}
                        />
                        <span className="text-xs text-muted-foreground">
                            {d.tahun}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Pkm({
    pkm,
    grafik = [],
    daftarTahun = [],
    daftarJenis = [],
    filters,
}: Props) {
    const [q, setQ] = useState(filters.q ?? "");
    const kosongTotal =
        pkm.data.length === 0 && !(filters.q || filters.jenis || filters.tahun);

    const ke = (ubah: Partial<Filters>) => {
        const p = new URLSearchParams();
        Object.entries({ ...filters, ...ubah }).forEach(
            ([k, v]) => v && p.set(k, String(v)),
        );
        const s = p.toString();
        return s ? `/pkm?${s}` : "/pkm";
    };

    const cari = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/pkm",
            { ...filters, q: q || undefined },
            { preserveState: true },
        );
    };

    const chip = (aktif: boolean) =>
        `rounded-sm px-4 py-2 text-sm font-semibold transition-colors ${
            aktif
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
        }`;

    return (
        <PublicAppLayout title="Pengabdian Kepada Masyarakat">
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
                <div className="page-shell py-16 md:py-24">
                    <p className="eyebrow text-gold">Data Pengabdian</p>
                    <h1 className="mt-4 font-display text-4xl md:text-6xl">
                        Pengabdian Kepada Masyarakat
                    </h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">
                        Kegiatan pengabdian dosen Universitas Cendekia Abditama
                        untuk memberdayakan masyarakat.
                    </p>
                    {!kosongTotal && (
                        <form
                            onSubmit={cari}
                            className="mt-8 flex max-w-xl gap-2"
                        >
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari judul kegiatan..."
                                className="h-11 flex-1 rounded-sm bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            />
                            <button
                                type="submit"
                                aria-label="Cari"
                                className="flex h-11 w-11 items-center justify-center rounded-sm bg-gold text-ink"
                            >
                                <Search className="size-5" />
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {kosongTotal ? (
                <section className="section-pad">
                    <div className="page-shell rounded-lg border bg-card px-6 py-16 text-center">
                        <div className="float-soft mx-auto flex size-20 items-center justify-center rounded-full bg-forest text-gold">
                            <HeartHandshake className="size-9" />
                        </div>
                        <h2 className="mt-6 font-display text-3xl text-forest">
                            Data pengabdian segera hadir
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                            Belum ada kegiatan pengabdian yang dipublikasikan.
                            Kegiatan dosen akan tampil di halaman ini.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-sm bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </section>
            ) : (
                <>
                    {grafik.length > 0 && (
                        <section className="section-pad bg-heritage-pattern pb-0">
                            <div className="page-shell">
                                <Grafik data={grafik} />
                            </div>
                        </section>
                    )}

                    <section className="section-pad">
                        <div className="page-shell">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={ke({ jenis: undefined })}
                                    className={chip(!filters.jenis)}
                                >
                                    Semua
                                </Link>
                                {daftarJenis.map((j) => (
                                    <Link
                                        key={j}
                                        href={ke({ jenis: j })}
                                        className={chip(filters.jenis === j)}
                                    >
                                        {j}
                                    </Link>
                                ))}
                                <select
                                    value={filters.tahun ?? ""}
                                    onChange={(e) =>
                                        router.get(
                                            ke({
                                                tahun:
                                                    e.target.value || undefined,
                                            }),
                                        )
                                    }
                                    aria-label="Filter tahun"
                                    className="ml-auto h-10 rounded-sm border bg-background px-3 text-sm"
                                >
                                    <option value="">Semua tahun</option>
                                    {daftarTahun.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className="mt-6 text-sm text-muted-foreground">
                                {pkm.total} kegiatan ditemukan
                            </p>

                            {pkm.data.length === 0 ? (
                                <div className="mt-6 rounded-lg border bg-card px-6 py-14 text-center">
                                    <h3 className="font-display text-2xl text-forest">
                                        Data tidak ditemukan
                                    </h3>
                                    <Link
                                        href="/pkm"
                                        className="mt-5 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
                                    >
                                        Reset filter
                                    </Link>
                                </div>
                            ) : (
                                <ul className="mt-4 divide-y rounded-lg border bg-card">
                                    {pkm.data.map((p) => (
                                        <li
                                            key={p.id}
                                            className="flex gap-4 p-5 md:p-6"
                                        >
                                            <div className="mt-1 hidden size-11 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary sm:flex">
                                                <HeartHandshake className="size-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                                                    {p.jenis && (
                                                        <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-primary">
                                                            {p.jenis}
                                                        </span>
                                                    )}
                                                    <span>{p.tahun}</span>
                                                    {p.semester && (
                                                        <span>
                                                            Semester{" "}
                                                            {p.semester}
                                                        </span>
                                                    )}
                                                </p>
                                                <h3 className="mt-2 font-display text-xl leading-snug text-forest">
                                                    {p.judul}
                                                </h3>
                                                <ul className="mt-3 space-y-1 text-sm">
                                                    {p.penulis.map((a, i) => (
                                                        <li key={i}>
                                                            <span className="font-medium">
                                                                {a.nama}
                                                            </span>
                                                            {a.afiliasi && (
                                                                <span className="text-muted-foreground">
                                                                    {" "}
                                                                    ·{" "}
                                                                    {a.afiliasi}
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {pkm.links.length > 3 && (
                                <nav
                                    className="mt-10 flex flex-wrap justify-center gap-2"
                                    aria-label="Halaman"
                                >
                                    {pkm.links.map((l, i) =>
                                        l.url ? (
                                            <Link
                                                key={i}
                                                href={l.url}
                                                preserveScroll
                                                className={`rounded-sm border px-4 py-2 text-sm font-semibold ${l.active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                            >
                                                {labelHalaman(l.label)}
                                            </Link>
                                        ) : (
                                            <span
                                                key={i}
                                                className="rounded-sm border px-4 py-2 text-sm text-muted-foreground/50"
                                            >
                                                {labelHalaman(l.label)}
                                            </span>
                                        ),
                                    )}
                                </nav>
                            )}
                        </div>
                    </section>
                </>
            )}
        </PublicAppLayout>
    );
}
