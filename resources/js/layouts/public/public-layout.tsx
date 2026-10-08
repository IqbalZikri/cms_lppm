import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowUp, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

const menu = [
    ["Beranda", "/"],
    ["Berita", "/berita"],
    ["Penelitian", "/penelitian"],
    ["Publikasi", "/publikasi"],
    ["Layanan", "/layanan"],
    ["Kontak", "/kontak"],
];

// Ganti dengan data resmi
const kontak = {
    alamat: "Kampus Islamic Village, Universitas Cendekia Abditama (isi alamat lengkap dan kode pos)",
    email: "lppm@uca.ac.id",
    web: "lppm.uca.ac.id",
    jam: "Senin sampai Jumat, 08.00 sampai 16.00 WIB",
    mapsQuery: "Universitas Cendekia Abditama", // ganti dengan alamat lengkap agar titik peta akurat
};
const sosmed = [
    [
        "Instagram",
        "https://instagram.com/",
        <>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </>,
    ],
    [
        "YouTube",
        "https://youtube.com/",
        <>
            <rect x="2" y="5" width="20" height="14" rx="4" />
            <path d="M10 9l5 3-5 3z" fill="currentColor" />
        </>,
    ],
    [
        "Facebook",
        "https://facebook.com/",
        <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />,
    ],
    ["X", "https://x.com/", <path d="M4 4l16 16M20 4L4 20" />],
    [
        "LinkedIn",
        "https://linkedin.com/",
        <>
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 11v6M8 8v.01M12 17v-6m0 3a3 3 0 0 1 6 0v3" />
        </>,
    ],
] as const;
const terkait = [
    ["Portal dosen", "/login"],
    ["Website Universitas UCA", "https://uca.ac.id"],
    ["SINTA", "https://sinta.kemdiktisaintek.go.id"],
    ["Google Scholar", "https://scholar.google.com"],
    ["Scopus", "https://www.scopus.com"],
];
const layananLink = [
    ["Pengajuan penelitian", "/layanan"],
    ["Pengabdian masyarakat", "/layanan"],
    ["Pengelolaan HKI", "/layanan"],
    ["Template dan panduan", "/layanan"],
    ["Pertanyaan umum", "/layanan"],
];

interface Flash {
    success?: string;
    error?: string;
}

export default function PublicAppLayout({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const { flash } = usePage<{ flash?: Flash }>().props;
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const [sub, setSub] = useState(false);
    const active = (h: string) => (h === "/" ? url === "/" : url.startsWith(h));
    const link = (h: string) =>
        `rounded-lg px-3 py-2 font-semibold transition ${active(h) ? "bg-uca-green text-white" : "text-uca-green hover:bg-uca-green/10"}`;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("theme-beranda");
        return () => root.classList.remove("theme-beranda");
    }, []);
    return (
        <div className="theme-beranda flex min-h-screen flex-col bg-background">
            <Head title={`${title} | LPPM UCA`} />
            <a
                href="#isi"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3"
            >
                Lewati ke konten
            </a>
            <nav className="sticky top-0 z-40 border-b-4 border-uca-gold bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo_uca.png"
                            alt="Logo UCA"
                            className="h-12 w-12 object-contain"
                        />
                        <span className=" leading-tight ">
                            <b className="font-display block text-sm text-uca-green md:text-base">
                                Lembaga Penelitian dan Pengabdian Masyarakat
                            </b>
                            <span className="text-xs text-slate-600">
                                Universitas Cendekia Abditama
                            </span>
                        </span>
                    </Link>
                    <div className="hidden items-center gap-1 lg:flex">
                        <Link href="/" className={link("/")} viewTransition>
                            Beranda
                        </Link>
                        <Link
                            href={route("profil")}
                            className={link("/profil")}
                            viewTransition
                        >
                            Profil
                        </Link>
                        {menu.slice(1).map(([l, h]) => (
                            <Link key={h} href={h} className={link(h)} viewTransition>
                                {l}
                            </Link>
                        ))}
                        <a
                            href="/login"
                            className="ml-2 rounded-xl bg-uca-red px-4 py-2 font-semibold text-white hover:opacity-90"
                        >
                            Portal dosen
                        </a>
                    </div>
                    <button
                        className="lg:hidden"
                        aria-label="Menu"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
                {open && (
                    <div className="border-t bg-white px-5 pb-4 lg:hidden">
                        <a
                            href="/login"
                            className="mt-2 block rounded-xl bg-uca-red px-4 py-3 text-center font-semibold text-white"
                        >
                            Portal dosen
                        </a>
                    </div>
                )}
            </nav>
            <main id="isi" className="flex-1">
                {children}
            </main>
            <footer className="relative overflow-hidden bg-uca-deep text-white/85">
                <div className="h-1.5 bg-gradient-to-r from-uca-gold via-uca-red to-uca-gold" />
                <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border-[28px] border-uca-gold/10" />
                <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo_uca.png"
                                alt=""
                                className="h-16 w-16 rounded-full bg-white object-contain p-1"
                            />
                            <b className="font-display text-lg leading-tight text-white">
                                Lembaga Penelitian dan Pengabdian Masyarakat
                            </b>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed">
                            Universitas Cendekia Abditama. Mendampingi dosen
                            meneliti, menerbitkan karya, dan mengabdi bagi
                            masyarakat.
                        </p>
                        <p className="mt-5 font-semibold text-white">
                            Ikuti kami
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {sosmed.map(([n, href, icon]) => (
                                <a
                                    key={n}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={n}
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-uca-gold hover:text-uca-deep"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="22"
                                        height="22"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {icon}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <b className="font-display text-lg text-uca-gold">
                            Tautan cepat
                        </b>
                        <ul className="mt-4 space-y-2.5">
                            {menu.map(([l, h]) => (
                                <li key={h}>
                                    <Link
                                        href={h}
                                        className="hover:text-uca-gold"
                                    >
                                        {l}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/profil/visi-misi"
                                    className="hover:text-uca-gold"
                                >
                                    Profil LPPM
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <b className="font-display text-lg text-uca-gold">
                            Layanan
                        </b>
                        <ul className="mt-4 space-y-2.5">
                            {layananLink.map(([l, h]) => (
                                <li key={l}>
                                    <Link
                                        href={h}
                                        className="hover:text-uca-gold"
                                    >
                                        {l}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <b className="font-display text-lg text-uca-gold">
                            Tautan terkait
                        </b>
                        <ul className="mt-4 space-y-2.5">
                            {terkait.map(([l, h]) => (
                                <li key={l}>
                                    <a href={h} className="hover:text-uca-gold">
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 rounded-xl bg-white/10 p-4 text-sm">
                            <b className="text-white">Jam operasional</b>
                            <br />
                            {kontak.jam}
                        </div>
                    </div>
                </div>
                <div className="relative border-t border-white/10">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-sm">
                        <span>
                            © {new Date().getFullYear()} LPPM Universitas
                            Cendekia Abditama. Seluruh hak dilindungi.
                        </span>
                        <button
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="flex items-center gap-2 rounded-full border border-uca-gold px-4 py-2 font-semibold text-uca-gold hover:bg-uca-gold hover:text-uca-deep"
                        >
                            <ArrowUp size={16} /> Kembali ke atas
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
