import { Link } from "@inertiajs/react";
import { Calendar, Eye } from "lucide-react";

export type BeritaItem = {
    id: number;
    judul: string;
    ringkasan: string | null;
    gambar: string | null;
    kategori: string | null;
    tanggal: string | null;
    slug: string;
    views: number;
};

export default function KartuBerita({ b }: { b: BeritaItem }) {
    return (
        <Link
            href={`/berita/${b.slug}`}
            className="lift-card group flex flex-col overflow-hidden rounded-lg border bg-card"
        >
            {b.gambar ? (
                <img
                    src={b.gambar}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover"
                />
            ) : (
                <div className="h-48 w-full bg-muted" />
            )}
            <div className="flex flex-1 flex-col p-5">
                {b.kategori && (
                    <span className="eyebrow text-primary">{b.kategori}</span>
                )}
                <h3 className="mt-2 font-display text-xl leading-snug text-forest group-hover:text-primary">
                    {b.judul}
                </h3>
                {b.ringkasan && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                        {b.ringkasan}
                    </p>
                )}
                <p className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {b.tanggal}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {b.views}
                    </span>
                </p>
            </div>
        </Link>
    );
}
