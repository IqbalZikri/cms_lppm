import PublicAppLayout from "@/layouts/public/public-layout";
import { stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";
import { motion } from "motion/react";

interface Props {
    visi: string;
    misi: string[];
}

export default function VisiMisi({ visi, misi = [] }: Props) {
    const [misiScope, animate] = useAnimate();
    const isMisiInView = useInView(misiScope, {
        once: true,
    });

    useEffect(() => {
        if (isMisiInView) {
            animate(
                "li",
                {
                    opacity: [0, 1],
                    y: [24, 0],
                },
                {
                    duration: 0.6,
                    ease: "easeOut",
                    delay: stagger(0.12),
                },
            );
        }
    }, [isMisiInView, animate]);
    return (
        <PublicAppLayout title="Visi & Misi">
            {/* Hero */}
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
                    <p className="eyebrow text-gold">Profil LPPM</p>
                    <h1 className="mt-4 font-display text-4xl md:text-6xl">
                        Visi & Misi
                    </h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">
                        Arah dan komitmen LPPM Universitas Cendekia Abditama
                        dalam mengembangkan riset, inovasi, dan pengabdian.
                    </p>
                </div>
            </section>

            {/* Visi */}
            <section className="section-pad bg-heritage-pattern">
                <div className="page-shell grid gap-10 ">
                    <div>
                        <p className="eyebrow text-primary">Visi</p>
                        <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                            Cita-cita yang kami tuju
                        </h2>
                    </div>
                    <div className="space-y-5">
                        {visi && (
                            <blockquote className="rounded-lg border-l-4 border-gold bg-card p-6 font-display text-xl leading-9 text-forest shadow-sm md:text-2xl">
                                {visi}
                            </blockquote>
                        )}
                    </div>
                    {!visi && (
                        <p className="text-muted-foreground">
                            Visi belum diisi.
                        </p>
                    )}
                </div>
            </section>

            {/* Misi */}

            {/* Misi */}
            <section className="section-pad bg-surface">
                <div className="page-shell">
                    <p className="eyebrow text-primary">Misi</p>

                    <h2 className="mt-3 font-display text-3xl text-forest md:text-4xl">
                        Langkah nyata untuk mewujudkannya
                    </h2>

                    <ol
                        ref={misiScope}
                        className="mt-10 grid gap-5 md:grid-cols-2"
                    >
                        {misi.map((item, i) => (
                            <li
                                key={i}
                                className="lift-card flex gap-5 rounded-lg border bg-card p-6 opacity-0"
                            >
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-forest font-display text-xl text-gold">
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                <p className="leading-7 text-foreground/85">
                                    {item}
                                </p>
                            </li>
                        ))}
                    </ol>

                    {misi.length === 0 && (
                        <p className="mt-6 text-muted-foreground">
                            Misi belum diisi.
                        </p>
                    )}
                </div>
            </section>
        </PublicAppLayout>
    );
}
