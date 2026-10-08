import { useMemo, useState } from "react";
import { IMG, researches, rupiah } from "@/lib/data";
import PublicAppLayout from "@/layouts/public/public-layout";
import { input, PageHero } from "@/components/public/ui";

export default function Penelitian() {
    const [q, setQ] = useState("");
    const [year, setYear] = useState("");
    const [src, setSrc] = useState("");
    const list = useMemo(
        () =>
            researches.filter(
                (r) =>
                    (!year || r.year === +year) &&
                    (!src || r.source === src) &&
                    (r.title + r.leader + r.faculty)
                        .toLowerCase()
                        .includes(q.toLowerCase()),
            ),
        [q, year, src],
    );
    const total = list.reduce((a, r) => a + r.amount, 0);
    return (
        <PublicAppLayout title="Penelitian">
            <PageHero
                title="Kumpulan penelitian"
                subtitle="Penelitian dosen UCA, lengkap dengan ketua, fakultas, dan sumber dana."
                image={IMG.gedung}
            />
            <div className="mx-auto max-w-6xl px-5 py-10">
                <div className="grid gap-3 md:grid-cols-4">
                    <input
                        className={input + " md:col-span-2"}
                        placeholder="Cari judul, peneliti, atau fakultas"
                        aria-label="Cari penelitian"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <select
                        className={input}
                        aria-label="Tahun"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Semua tahun</option>
                        {[2023, 2024, 2025].map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        className={input}
                        aria-label="Sumber dana"
                        value={src}
                        onChange={(e) => setSrc(e.target.value)}
                    >
                        <option value="">Semua sumber dana</option>
                        <option>Internal</option>
                        <option>Eksternal</option>
                    </select>
                </div>
                <p className="mt-4 text-slate-600">
                    {list.length} penelitian, total dana{" "}
                    <b className="text-uca-green">{rupiah(total)}</b>
                </p>
                <div className="mt-5 space-y-4">
                    {list.map((r) => (
                        <div
                            key={r.id}
                            className="rounded-2xl border-l-8 border-uca-gold bg-white p-5 shadow"
                        >
                            <h2 className="font-display text-xl font-bold text-uca-green">
                                {r.title}
                            </h2>
                            <p className="mt-1 text-slate-700">
                                {r.leader} · Fakultas {r.faculty}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                                <span className="rounded-full bg-uca-cream px-3 py-1">
                                    Semester {r.semester} {r.year}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-white ${r.source === "Internal" ? "bg-uca-green" : "bg-uca-red"}`}
                                >
                                    Dana {r.source}
                                </span>
                                <span className="rounded-full bg-uca-gold/30 px-3 py-1">
                                    {rupiah(r.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                    {list.length === 0 && (
                        <p className="rounded-2xl bg-white p-8 text-center font-semibold text-uca-green">
                            Tidak ada penelitian yang cocok dengan filter ini.
                        </p>
                    )}
                </div>
            </div>
        </PublicAppLayout>
    );
}
