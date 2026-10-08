import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { IMG, categories, news, tgl } from "@/lib/data";
import PublicAppLayout from "@/layouts/public/public-layout";
import { input, PageHero } from "@/components/public/ui";

export default function Index() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("Semua");
    const list = useMemo(
        () =>
            news.filter(
                (n) =>
                    (cat === "Semua" || n.category === cat) &&
                    (n.title + n.excerpt)
                        .toLowerCase()
                        .includes(q.toLowerCase()),
            ),
        [q, cat],
    );
    return (
        <PublicAppLayout title="Berita">
            <PageHero
                title="Berita"
                subtitle="Kabar terbaru kegiatan penelitian, pengabdian, dan publikasi."
                image={IMG.kampus}
            />
            <div className="mx-auto max-w-6xl px-5 py-10">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul atau isi berita"
                        aria-label="Cari berita"
                        className={input + " pl-12"}
                    />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            aria-pressed={cat === c}
                            className={`rounded-full px-4 py-2 font-semibold ${cat === c ? "bg-uca-green text-white" : "bg-white text-uca-green ring-1 ring-uca-green/30"}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <p className="mt-5 text-slate-600">
                    {list.length} berita ditemukan
                </p>
                {list.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-white p-10 text-center">
                        <p className="font-semibold text-uca-green">
                            Tidak ada berita yang cocok.
                        </p>
                        <button
                            className="mt-3 font-semibold text-uca-red"
                            onClick={() => {
                                setQ("");
                                setCat("Semua");
                            }}
                        >
                            Hapus pencarian dan filter
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {list.map((n) => (
                            <Link
                                key={n.slug}
                                href={`/berita/${n.slug}`}
                                className="group overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={n.image}
                                        alt=""
                                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5">
                                    <span className="text-sm font-bold text-uca-red">
                                        {n.category}
                                    </span>
                                    <h2 className="font-display mt-1 text-xl font-bold text-uca-green">
                                        {n.title}
                                    </h2>
                                    <p className="mt-2 text-slate-600">
                                        {n.excerpt}
                                    </p>
                                    <p className="mt-3 text-sm text-slate-500">
                                        {tgl(n.date)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicAppLayout>
    );
}
