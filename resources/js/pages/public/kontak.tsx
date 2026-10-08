import { useForm } from "@inertiajs/react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { IMG } from "@/lib/data";
import PublicAppLayout from "@/layouts/public/public-layout";
import { btn, input, PageHero } from "@/components/public/ui";

const info = [
    [
        MapPin,
        "Alamat",
        "Kampus Islamic Village, Universitas Cendekia Abditama (isi alamat lengkap)",
    ],
    [Phone, "Telepon", "(021) 0000 0000"],
    [Mail, "Email", "lppm@uca.ac.id (website: lppm.uca.ac.id)"],
    [Clock, "Jam layanan", "Senin sampai Jumat, 08.00 sampai 16.00"],
] as const;
export default function Kontak() {
    const f = useForm({ nama: "", email: "", pesan: "" });
    return (
        <PublicAppLayout title="Kontak">
            <PageHero
                title="Hubungi kami"
                subtitle="Tanyakan skema pendanaan, HKI, atau kendala di portal dosen."
                image={IMG.gedung}
            />
            <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2">
                <div className="space-y-4">
                    {info.map(([I, t, v]) => (
                        <div
                            key={t}
                            className="flex gap-4 rounded-2xl bg-white p-5 shadow"
                        >
                            <I className="mt-1 shrink-0 text-uca-red" />
                            <div>
                                <b className="text-uca-green">{t}</b>
                                <p className="text-slate-700">{v}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        f.post("/kontak", { onSuccess: () => f.reset() });
                    }}
                    className="space-y-4 rounded-2xl bg-white p-6 shadow"
                >
                    <h2 className="font-display text-2xl font-bold text-uca-green">
                        Kirim pesan
                    </h2>
                    <label className="block font-semibold">
                        Nama
                        <input
                            className={input + " mt-1"}
                            value={f.data.nama}
                            onChange={(e) => f.setData("nama", e.target.value)}
                            required
                        />
                    </label>
                    <label className="block font-semibold">
                        Email
                        <input
                            type="email"
                            className={input + " mt-1"}
                            value={f.data.email}
                            onChange={(e) => f.setData("email", e.target.value)}
                            required
                        />
                    </label>
                    <label className="block font-semibold">
                        Pesan
                        <textarea
                            rows={5}
                            className={input + " mt-1"}
                            value={f.data.pesan}
                            onChange={(e) => f.setData("pesan", e.target.value)}
                            required
                        />
                    </label>
                    {f.errors.pesan && (
                        <p className="text-uca-red">{f.errors.pesan}</p>
                    )}
                    {f.recentlySuccessful && (
                        <p className="font-semibold text-uca-green">
                            Pesan terkirim. Kami membalas dalam 2 hari kerja.
                        </p>
                    )}
                    <button disabled={f.processing} className={btn}>
                        Kirim pesan
                    </button>
                </form>
            </div>
        </PublicAppLayout>
    );
}
