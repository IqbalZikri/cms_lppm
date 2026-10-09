import { Link, router } from "@inertiajs/react";
import { motion } from "motion/react";
import {
    BookOpen,
    ExternalLink,
    FileText,
    Presentation,
    Search,
} from "lucide-react";
import { FormEvent, useState } from "react";
import PublicAppLayout from "@/layouts/public/public-layout";

type Jenis = "jurnal" | "prosiding" | "buku";
type PageLink = { url: string | null; label: string; active: boolean };
type Item = {
    id: string;
    judul: string;
    tahun: string | number;
    jenis: Jenis;
    label: string;
    venue: string | null;
    link: string | null;
    penulis: { nama: string; afiliasi: string | null }[];
};
type Titik = { tahun: string } & Record<Jenis, number>;
type Filters = { q?: string; jenis?: string; tahun?: string };

interface Props {
    publikasi: { data: Item[]; links: PageLink[]; total: number };
    grafik: Titik[];
    daftarTahun: (string | number)[];
    filters: Filters;
}

const gaya: Record<
    Jenis,
    { icon: typeof FileText; badge: string; bar: string; nama: string }
> = {
    jurnal: {
        icon: FileText,
        badge: "bg-primary/10 text-primary",
        bar: "bg-primary",
        nama: "Jurnal",
    },
    prosiding: {
        icon: Presentation,
        badge: "bg-gold/20 text-amber",
        bar: "bg-gold",
        nama: "Prosiding",
    },
    buku: {
        icon: BookOpen,
        badge: "bg-forest/10 text-forest",
        bar: "bg-amber",
        nama: "Buku",
    },
};
const urutan: Jenis[] = ["jurnal", "prosiding", "buku"];

const labelHalaman = (l: string) =>
    l.includes("Previous")
        ? "Sebelumnya"
        : l.includes("Next")
          ? "Berikutnya"
          : l;

function Grafik({ data }: { data: Titik[] }) {
    const maks = Math.max(1, ...data.flatMap((d) => urutan.map((j) => d[j])));
    const tinggi = (n: number) =>
        `${Math.max(n > 0 ? 6 : 0, (n / maks) * 160)}px`;

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-xl text-forest">
                    Jumlah luaran per tahun
                </h2>
                <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                    {urutan.map((j) => (
                        <span key={j} className="flex items-center gap-1.5">
                            <i className={`size-3 rounded-sm ${gaya[j].bar}`} />
                            {gaya[j].nama}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-8 flex items-end gap-4">
                {data.map((d) => (
                    <div
                        key={d.tahun}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <div className="flex items-end gap-1">
                            {urutan.map((j) => (
                                <div
                                    key={j}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <span className="text-[11px] font-semibold">
                                        {d[j]}
                                    </span>
                                    <div
                                        className={`w-4 rounded-t-sm transition-[height] duration-500 ${gaya[j].bar}`}
                                        style={{ height: tinggi(d[j]) }}
                                    />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {d.tahun}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Publikasi({
    publikasi,
    grafik = [],
    daftarTahun = [],
    filters,
}: Props) {
    const [q, setQ] = useState(filters.q ?? "");
    const kosongTotal =
        publikasi.data.length === 0 &&
        !(filters.q || filters.jenis || filters.tahun);

    const ke = (ubah: Partial<Filters>) => {
        const p = new URLSearchParams();
        Object.entries({ ...filters, ...ubah }).forEach(
            ([k, v]) => v && p.set(k, String(v)),
        );
        const s = p.toString();
        return s ? `/publikasi?${s}` : "/publikasi";
    };

    const cari = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/publikasi",
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
        <PublicAppLayout title="Publikasi">
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
                    <p className="eyebrow text-gold">Repositori Luaran</p>
                    <h1 className="mt-4 font-display text-4xl md:text-6xl">
                        Publikasi
                    </h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">
                        Luaran jurnal, prosiding, dan buku karya dosen
                        Universitas Cendekia Abditama.
                    </p>
                    {!kosongTotal && (
                        <form
                            onSubmit={cari}
                            className="mt-8 flex max-w-xl gap-2"
                        >
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari judul publikasi..."
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
                            <BookOpen className="size-9" />
                        </div>
                        <h2 className="mt-6 font-display text-3xl text-forest">
                            Repositori segera hadir
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                            Belum ada publikasi yang ditampilkan. Jurnal,
                            prosiding, dan buku dosen akan muncul di halaman
                            ini.
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
                                {urutan.map((j) => (
                                    <Link
                                        key={j}
                                        href={ke({ jenis: j })}
                                        className={chip(filters.jenis === j)}
                                    >
                                        {gaya[j].nama}
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
                                {publikasi.total} publikasi ditemukan
                            </p>

                            {publikasi.data.length === 0 ? (
                                <div className="mt-6 rounded-lg border bg-card px-6 py-14 text-center">
                                    <h3 className="font-display text-2xl text-forest">
                                        Publikasi tidak ditemukan
                                    </h3>
                                    <Link
                                        href="/publikasi"
                                        className="mt-5 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
                                    >
                                        Reset filter
                                    </Link>
                                </div>
                            ) : (
                                <ul className="mt-4 divide-y rounded-lg border bg-card">
                                    {publikasi.data.map((p) => {
                                        const g = gaya[p.jenis];
                                        const Icon = g.icon;
                                        return (
                                            <li
                                                key={p.id}
                                                className="flex gap-4 p-5 md:p-6"
                                            >
                                                <div
                                                    className={`mt-1 hidden size-11 shrink-0 items-center justify-center rounded-sm sm:flex ${g.badge}`}
                                                >
                                                    <Icon className="size-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                                                        <span
                                                            className={`rounded-sm px-2 py-0.5 ${g.badge}`}
                                                        >
                                                            {p.label}
                                                        </span>
                                                        <span>{p.tahun}</span>
                                                    </p>
                                                    <h3 className="mt-2 font-display text-xl leading-snug text-forest">
                                                        {p.judul}
                                                    </h3>
                                                    {p.venue && (
                                                        <p className="mt-1 text-sm italic text-muted-foreground">
                                                            {p.venue}
                                                        </p>
                                                    )}
                                                    <ul className="mt-3 space-y-1 text-sm">
                                                        {p.penulis.map(
                                                            (a, i) => (
                                                                <li key={i}>
                                                                    <span className="font-medium">
                                                                        {a.nama}
                                                                    </span>
                                                                    {a.afiliasi && (
                                                                        <span className="text-muted-foreground">
                                                                            {" "}
                                                                            ·{" "}
                                                                            {
                                                                                a.afiliasi
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                    {p.link && (
                                                        <a
                                                            href={p.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-amber"
                                                        >
                                                            Buka publikasi{" "}
                                                            <ExternalLink className="size-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {publikasi.links.length > 3 && (
                                <nav
                                    className="mt-10 flex flex-wrap justify-center gap-2"
                                    aria-label="Halaman"
                                >
                                    {publikasi.links.map((l, i) =>
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
