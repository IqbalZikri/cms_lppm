import { Newspaper } from "lucide-react";

interface Props {
    kategori?: string | null;
    className?: string;
}

export default function BeritaCover({ kategori, className = "" }: Props) {
    return (
        <div
            aria-hidden="true"
            className={`relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-forest via-forest to-primary text-gold md:h-80 ${className}`}
        >
            {/* pola titik, warnanya mengikuti text-gold */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            {/* cahaya dekoratif */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />

            {/* cincin konsentris */}
            <div className="absolute h-56 w-56 animate-pulse rounded-full border border-gold/25" />
            <div className="absolute h-80 w-80 rounded-full border border-gold/15" />
            <div className="absolute h-[28rem] w-[28rem] rounded-full border border-gold/10" />

            {/* garis aksen */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* ikon utama */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-gold/40 bg-white/10 shadow-2xl backdrop-blur-md md:h-32 md:w-32">
                <Newspaper
                    className="size-14 text-gold md:size-16"
                    strokeWidth={1.25}
                />
            </div>

            {/* label kategori */}
            {kategori && (
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-gold/30 bg-black/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur-sm">
                    {kategori}
                </span>
            )}
        </div>
    );
}
