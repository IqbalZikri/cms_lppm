import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { route } from "ziggy-js";

const mainLinks = [
    { label: "Beranda", href: "/" },
    { label: "Berita", href: "/berita" },
    { label: "Penelitian", href: "/penelitian" },
    { label: "Publikasi", href: "/publikasi" },
    { label: "PKM", href: "/pkm" },
    { label: "Kontak", href: "/kontak" },
] as const;

const profileLinks = [
    { label: "Visi & Misi", href: "/profil/visi-misi" },
] as const;

export default function SiteHeader() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // url dari Inertia, mis. "/berita/judul-berita?page=2"
    const { url } = usePage();
    const path = url.split("?")[0];

    const isActive = (href: string) =>
        href === "/"
            ? path === "/"
            : path === href || path.startsWith(`${href}/`);

    const isProfileActive = path.startsWith("/profil");

    const [beranda, ...otherLinks] = mainLinks;
    const closeMenu = () => {
        setOpen(false);
        setProfileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
            <div className="hidden bg-forest text-primary-foreground md:block">
                <div className="page-shell flex h-9 items-center justify-between text-xs">
                    <span>Universitas Cendekia Abditama</span>
                    <div className="flex items-center gap-5 text-primary-foreground/75">
                        <span className="flex items-center gap-1.5">
                            <Mail className="size-3.5" /> lppm@uca.ac.id
                        </span>
                        <span>Senin–Jumat, 08.00–16.00 WIB</span>
                    </div>
                </div>
            </div>

            <div className="page-shell flex h-20 items-center justify-between">
                <Link
                    href="/"
                    className="flex min-w-0 items-center gap-3"
                    aria-label="LPPM UCA - Beranda"
                >
                    <img
                        src="/images/logo_uca.png"
                        alt="Logo Universitas Cendekia Abditama"
                        className="h-14 w-14 shrink-0 object-contain"
                    />
                    <div className="min-w-0 border-l border-border pl-3">
                        <strong className="block font-display text-xl leading-none text-forest">
                            LPPM UCA
                        </strong>
                        <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Riset • Inovasi • Pengabdian
                        </span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Navigasi utama"
                >
                    <Link
                        href={beranda.href}
                        className={`nav-link ${isActive(beranda.href) ? "nav-link-active" : ""}`}
                        aria-current={
                            isActive(beranda.href) ? "page" : undefined
                        }
                        viewTransition
                    >
                        {beranda.label}
                    </Link>

                    <div className="group relative">
                        <button
                            type="button"
                            className={`nav-link flex items-center gap-1 ${isProfileActive ? "nav-link-active" : ""}`}
                            aria-haspopup="menu"
                        >
                            Profil
                            <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                        </button>
                        <div className="invisible absolute left-0 top-full w-64 translate-y-2 border-t-2 border-gold bg-background p-2 opacity-0 shadow-2xl transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                            {profileLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block rounded-sm px-4 py-3 text-sm font-medium hover:bg-muted hover:text-primary ${
                                        isActive(item.href)
                                            ? "bg-muted text-primary"
                                            : ""
                                    }`}
                                    viewTransition
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {otherLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}
                            aria-current={
                                isActive(item.href) ? "page" : undefined
                            }
                            viewTransition
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Link href={route("login")} viewTransition>
                        <Button variant={"default"}>Login</Button>
                    </Link>
                </nav>

                <Button
                    size="icon"
                    variant="ghost"
                    className="lg:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Tutup menu" : "Buka menu"}
                    aria-expanded={open}
                >
                    {open ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Mobile nav */}
            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t bg-background lg:hidden"
                    >
                        <div className="page-shell space-y-1 py-4">
                            <Link
                                href={beranda.href}
                                onClick={closeMenu}
                                className={`mobile-link ${isActive(beranda.href) ? "mobile-link-active" : ""}`}
                                viewTransition
                            >
                                {beranda.label}
                            </Link>

                            <button
                                type="button"
                                className={`mobile-link flex w-full justify-between ${isProfileActive ? "mobile-link-active" : ""}`}
                                onClick={() => setProfileOpen((v) => !v)}
                                aria-expanded={profileOpen}
                            >
                                Profil
                                <ChevronDown
                                    className={`size-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="ml-4 border-l border-border pl-3">
                                    {profileLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`mobile-link text-sm ${isActive(item.href) ? "mobile-link-active" : ""}`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {otherLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`mobile-link ${isActive(item.href) ? "mobile-link-active" : ""}`}
                                    viewTransition
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
