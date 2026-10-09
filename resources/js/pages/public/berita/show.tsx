import { Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import PublicAppLayout from "@/layouts/public/public-layout";
import KartuBerita, { BeritaItem } from "@/components/public/kartu-berita";

interface Props {
    berita: BeritaItem & { isi: string };
    terkait: BeritaItem[];
}

export default function BeritaShow({ berita, terkait = [] }: Props) {
    return (
        <PublicAppLayout title={berita.judul}>
            <section className="bg-forest text-primary-foreground">
                <div className="page-shell max-w-4xl py-14 md:py-20">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-gold"
                    >
                        <ArrowLeft className="size-4" /> Semua berita
                    </Link>
                    {berita.kategori && (
                        <p className="eyebrow mt-6 text-gold">
                            {berita.kategori}
                        </p>
                    )}
                    <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
                        {berita.judul}
                    </h1>
                    <p className="mt-5 flex items-center gap-5 text-sm text-primary-foreground/70">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            {berita.tanggal}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="size-4" />
                            {berita.views} kali dibaca
                        </span>
                    </p>
                </div>
            </section>

            <article className="section-pad">
                <div className="page-shell max-w-4xl">
                    {berita.gambar && (
                        <img
                            src={berita.gambar}
                            alt={berita.judul}
                            className="mb-10 max-h-[28rem] w-full rounded-lg object-cover"
                        />
                    )}
                    {berita.ringkasan && (
                        <p className="mb-8 border-l-4 border-gold pl-5 font-display text-xl leading-8 text-forest">
                            {berita.ringkasan}
                        </p>
                    )}
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest prose-a:text-primary prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: berita.isi }}
                    />
                </div>
            </article>

            {terkait.length > 0 && (
                <section className="section-pad bg-surface">
                    <div className="page-shell">
                        <h2 className="font-display text-3xl text-forest">
                            Berita terkait
                        </h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {terkait.map((b) => (
                                <KartuBerita key={b.id} b={b} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicAppLayout>
    );
}
