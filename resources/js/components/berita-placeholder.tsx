import { Newspaper, Sparkles } from "lucide-react";

export default function BeritaPlaceholder({ featured = false }: { featured?: boolean }) {
    return (
        <div
            aria-hidden="true"
            className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/25 ${
                featured ? "h-72 md:h-full md:min-h-[320px]" : "h-48"
            }`}
        >
            {/* pola titik */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                }}
            />

            {/* blob dekoratif */}
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-14 -left-10 h-52 w-52 rounded-full bg-secondary/30 blur-3xl" />

            {/* cincin dekoratif */}
            <div className="absolute h-44 w-44 rounded-full border border-primary/15 transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute h-64 w-64 rounded-full border border-primary/10 transition-transform duration-700 group-hover:scale-110" />

            {/* ikon utama */}
            <div
                className={`relative flex items-center justify-center rounded-2xl border border-primary/20 bg-background/70 shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${
                    featured ? "h-28 w-28" : "h-20 w-20"
                }`}
            >
                <Newspaper
                    className={
                        featured
                            ? "h-14 w-14 text-primary"
                            : "h-10 w-10 text-primary"
                    }
                    strokeWidth={1.5}
                />
            </div>
        </div>
    );
}
