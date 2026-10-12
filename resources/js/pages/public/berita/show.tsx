import { motion } from "motion/react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import PublicAppLayout from "@/layouts/public/public-layout";
import KartuBerita, { BeritaItem } from "@/components/public/kartu-berita";
import BeritaCover from "@/components/berita-cover";

interface Props {
    berita: BeritaItem & { isi: string };
    terkait: BeritaItem[];
}

export default function BeritaShow({ berita, terkait = [] }: Props) {
    return (
        <PublicAppLayout title={berita.judul}>
            <section className="relative isolate overflow-hidden bg-forest text-primary-foreground">
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
                    {berita.gambar ? (
                        <img
                            src={berita.gambar}
                            alt={berita.judul}
                            className="mb-10 max-h-[28rem] w-full rounded-lg object-cover"
                        />
                    ) : (
                        <BeritaCover
                            kategori={berita.kategori}
                            className="mb-10"
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
