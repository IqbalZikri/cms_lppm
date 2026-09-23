import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { BTN_SECONDARY, PORTAL_MENU, ROUTES } from "@/lib/lppm";
import { cn } from "@/lib/utils";
import type { SharedProps } from "@/types/lppm";

type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    exact?: boolean;
};

const NAV: NavItem[] = [
    {
        href: ROUTES.dashboard,
        label: "Beranda",
        icon: LayoutDashboard,
        exact: true,
    },
    ...PORTAL_MENU.map(({ href, label, icon }) => ({ href, label, icon })),
];

function Brand() {
    return (
        <Link
            href={ROUTES.dashboard}
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600"
        >
            {/* Simpan logo di public/images/logo-uca.jpg */}
            <img
                src="/images/logo-uca.jpg"
                alt="Logo Universitas Cendekia Abditama"
                className="size-16 object-contain"
            />
            <span className="block leading-tight">
                <span className="block font-uca-title text-2xl font-bold text-uca-green-800">
                    LPPM
                </span>
                <span className="block text-base font-bold text-slate-700">
                    Universitas Cendekia Abditama
                </span>
            </span>
        </Link>
    );
}

export default function DosenLayout({ children }: { children: ReactNode }) {
    const { url, props } = usePage<SharedProps>();
    const [open, setOpen] = useState(false);

    const path = url.split("?")[0];
    const name = props.auth?.user?.name ?? "Dosen";
    const isActive = (item: NavItem) =>
        item.exact
            ? path === item.href
            : path === item.href || path.startsWith(`${item.href}/`);

    return (
        <div className="min-h-screen bg-uca-gold-50 font-uca-body text-lg text-slate-900">
            <a
                href="#isi-halaman"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-uca-green-800 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
            >
                Lewati ke isi halaman
            </a>

            {/* Bilah atas untuk layar kecil */}
            <div className="sticky top-0 z-30 flex h-24 items-center justify-between border-b-2 border-slate-300 bg-white px-4 lg:hidden">
                <Brand />
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-controls="menu-dosen"
                    className="inline-flex h-14 items-center gap-2 rounded-xl border-2 border-uca-green-800 px-4 text-lg font-bold text-uca-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600"
                >
                    <Menu className="size-6" aria-hidden />
                    Menu
                </button>
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />
            )}

            <aside
                id="menu-dosen"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-80 max-w-[90vw] flex-col overflow-y-auto border-r-2 border-slate-300 bg-white",
                    "transition-transform motion-reduce:transition-none lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex items-center justify-between gap-2 p-5">
                    <Brand />
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Tutup menu"
                        className="grid size-12 shrink-0 place-items-center rounded-xl text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600 lg:hidden"
                    >
                        <X className="size-7" aria-hidden />
                    </button>
                </div>

                <nav
                    aria-label="Menu dosen"
                    className="flex-1 space-y-2 px-4 py-2"
                >
                    {NAV.map((item) => {
                        const active = isActive(item);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex min-h-14 items-center gap-4 rounded-xl px-4 text-xl font-bold transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600",
                                    active
                                        ? "bg-uca-green-800 text-white"
                                        : "text-uca-green-900 hover:bg-uca-green-50",
                                )}
                            >
                                <Icon className="size-7 shrink-0" aria-hidden />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-3 border-t-2 border-slate-200 p-5">
                    <p className="text-lg text-slate-700">Masuk sebagai</p>
                    <p className="break-words text-xl font-bold text-uca-green-900">
                        {name}
                    </p>
                    <Link
                        href={ROUTES.logout}
                        method="post"
                        as="button"
                        className={cn(BTN_SECONDARY, "w-full")}
                        viewTransition
                    >
                        <LogOut className="size-6" aria-hidden />
                        Keluar
                    </Link>
                </div>
            </aside>

            <main id="isi-halaman" className="lg:pl-80">
                <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-8 sm:py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
