import { Link } from "@inertiajs/react";
import { IMG, misi, sejarah, struktur } from "@/lib/data";
import PublicAppLayout from "@/layouts/public/public-layout";
import { PageHero } from "@/components/public/ui";

const tabs = [
    ["visi-misi", "Visi dan misi"],
    ["struktur", "Struktur kepengurusan"],
    ["sejarah", "Sejarah"],
];
export default function Show({
    section,
}: {
    section: "visi-misi" | "struktur" | "sejarah";
}) {
    const label = tabs.find((t) => t[0] === section)?.[1] ?? "Profil";
    return (
        <PublicAppLayout title={label}>
            <PageHero
                title={label}
                subtitle="Profil Lembaga Penelitian dan Pengabdian Masyarakat UCA"
                image={IMG.gedung}
            />
            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
                <aside className="space-y-2">
                    {tabs.map(([k, l]) => (
                        <Link
                            key={k}
                            href={`/profil/${k}`}
                            className={`block rounded-xl px-4 py-3 font-semibold ${k === section ? "bg-uca-green text-white" : "bg-white text-uca-green hover:bg-uca-gold/30"}`}
                        >
                            {l}
                        </Link>
                    ))}
                </aside>
                <div className="md:col-span-3">
                    {section === "visi-misi" && (
                        <>
                            <div className="rounded-2xl bg-uca-green p-8 text-white">
                                <h2 className="font-display text-2xl font-bold text-uca-gold">
                                    Visi
                                </h2>
                                <p className="font-display mt-3 text-2xl leading-snug">
                                    Menjadi lembaga riset dan pengabdian yang
                                    unggul, berintegritas, dan berdampak bagi
                                    masyarakat.
                                </p>
                            </div>
                            <h2 className="font-display mb-4 mt-10 text-2xl font-bold text-uca-green">
                                Misi
                            </h2>
                            <ol className="space-y-3">
                                {misi.map((m, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-4 rounded-xl bg-white p-4 shadow"
                                    >
                                        <b className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-uca-gold text-uca-deep">
                                            {i + 1}
                                        </b>
                                        {m}
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                    {section === "struktur" && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {struktur.map((s, i) => (
                                <div
                                    key={s.role}
                                    className={`rounded-2xl bg-white p-6 shadow ${i === 0 ? "border-t-8 border-uca-red sm:col-span-2" : "border-t-8 border-uca-gold"}`}
                                >
                                    <p className="font-semibold text-uca-red">
                                        {s.role}
                                    </p>
                                    <p className="font-display mt-1 text-xl font-bold text-uca-green">
                                        {s.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    {section === "sejarah" && (
                        <ol className="relative space-y-6 border-l-4 border-uca-gold pl-8">
                            {sejarah.map(([t, d]) => (
                                <li key={t} className="relative">
                                    <span className="absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-uca-gold bg-uca-green" />
                                    <h3 className="font-display text-xl font-bold text-uca-green">
                                        {t}
                                    </h3>
                                    <p className="mt-1 text-slate-700">{d}</p>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </PublicAppLayout>
    );
}
