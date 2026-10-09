import { Link } from "@inertiajs/react";
import { BookOpen, FlaskConical, Newspaper, Users } from "lucide-react";

const tautan = [
    { icon: FlaskConical, label: "Penelitian", href: "/penelitian" },
    { icon: BookOpen, label: "Publikasi", href: "/publikasi" },
    { icon: Users, label: "Visi & Misi", href: "/profil/visi-misi" },
];

export default function BeritaKosong() {
    return (
        <div>
            <div className="relative overflow-hidden rounded-lg border bg-card px-6 py-16 text-center md:py-24">
                <div
                    className="bg-heritage-pattern absolute inset-0 opacity-60"
                    aria-hidden
                />
                <div className="relative">
                    <div className="float-soft mx-auto flex size-24 items-center justify-center rounded-full bg-forest text-gold shadow-lg">
                        <Newspaper className="size-11" />
                    </div>
                    <p className="eyebrow mt-8 text-primary">Segera Hadir</p>
                    <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                        Kabar terbaru sedang kami siapkan
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                        Belum ada berita yang diterbitkan. Cerita dampak, agenda
                        kegiatan, dan pengumuman LPPM akan muncul di halaman
                        ini.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/"
                            className="rounded-sm bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                            viewTransition
                        >
                            Kembali ke Beranda
                        </Link>
                        <Link
                            href="/kontak"
                            className="rounded-sm border border-primary/40 px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-muted"
                            viewTransition
                        >
                            Hubungi LPPM
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pratinjau kartu berita */}
            <div className="mt-10 grid gap-6 sm:grid-cols-3" aria-hidden>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-lg border bg-card/60"
                    >
                        <div className="h-36 animate-pulse bg-muted" />
                        <div className="space-y-3 p-5">
                            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <p className="text-center text-sm font-semibold text-muted-foreground">
                    Sementara itu, jelajahi
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {tautan.map(({ icon: Icon, label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className="lift-card flex items-center gap-4 rounded-lg border bg-card p-5"
                            viewTransition
                        >
                            <Icon className="size-7 text-primary" />
                            <span className="font-display text-lg text-forest">
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
