import { Link, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";
import PublicAppLayout from "@/layouts/public/public-layout";
import KartuBerita, { BeritaItem } from "@/components/public/kartu-berita";
import BeritaKosong from "@/components/public/berita-kosong";
import { motion } from "motion/react";

type PageLink = { url: string | null; label: string; active: boolean };

interface Props {
    berita: { data: BeritaItem[]; links: PageLink[] };
    kategori: { id: number; nama_kategori: string }[];
    filters: { q?: string; kategori?: string };
}

const labelHalaman = (l: string) =>
    l.includes("Previous")
        ? "Sebelumnya"
        : l.includes("Next")
          ? "Berikutnya"
          : l;

export default function BeritaIndex({ berita, kategori, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? "");

    console.log(berita);

    const kosongTotal =
        berita.data.length === 0 && !filters.q && !filters.kategori;

    const cari = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/berita",
            { q: q || undefined, kategori: filters.kategori },
            { preserveState: true },
        );
    };

    const urlKategori = (id?: number) => {
        const p = new URLSearchParams();
        if (filters.q) p.set("q", filters.q);
        if (id) p.set("kategori", String(id));
        const s = p.toString();
        return s ? `/berita?${s}` : "/berita";
    };

    const chip = (aktif: boolean) =>
        `rounded-sm px-4 py-2 text-sm font-semibold transition-colors ${
            aktif
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
        }`;

    return (
        <PublicAppLayout title="Berita">
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
                    <p className="eyebrow text-gold">Kabar Terkini</p>
                    <h1 className="mt-4 font-display text-4xl md:text-6xl">
                        Berita & Agenda
                    </h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">
                        Kabar terbaru, cerita dampak, dan kegiatan LPPM
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
                                placeholder="Cari judul berita..."
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

            <section className="section-pad">
                <div className="page-shell">
                    {kosongTotal ? (
                        <BeritaKosong />
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={urlKategori()}
                                    className={chip(!filters.kategori)}
                                >
                                    Semua
                                </Link>
                                {kategori.map((k) => (
                                    <Link
                                        key={k.id}
                                        href={urlKategori(k.id)}
                                        className={chip(
                                            filters.kategori === String(k.id),
                                        )}
                                    >
                                        {k.nama_kategori}
                                    </Link>
                                ))}
                            </div>

                            {berita.data.length === 0 ? (
                                <div className="mt-8 rounded-lg border bg-card px-6 py-14 text-center">
                                    <Search className="mx-auto size-10 text-muted-foreground/50" />
                                    <h2 className="mt-4 font-display text-2xl text-forest">
                                        Berita tidak ditemukan
                                    </h2>
                                    <p className="mt-2 text-muted-foreground">
                                        Coba kata kunci lain atau pilih kategori
                                        yang berbeda.
                                    </p>
                                    <Link
                                        href="/berita"
                                        className="mt-6 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
                                    >
                                        Tampilkan semua berita
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {berita.data.map((b) => (
                                        <KartuBerita key={b.id} b={b} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {berita.links.length > 3 && (
                        <nav
                            className="mt-12 flex flex-wrap justify-center gap-2"
                            aria-label="Halaman"
                        >
                            {berita.links.map((l, i) =>
                                l.url ? (
                                    <Link
                                        key={i}
                                        href={l.url}
                                        preserveScroll
                                        className={`rounded-sm border px-4 py-2 text-sm font-semibold ${
                                            l.active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "hover:bg-muted"
                                        }`}
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
        </PublicAppLayout>
    );
}
