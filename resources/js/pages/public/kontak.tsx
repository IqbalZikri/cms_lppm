import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Twitter,
} from "lucide-react";
import PublicAppLayout from "@/layouts/public/public-layout";

interface Props {
    kontak: {
        telepon: string | null;
        whatsapp: string | null;
        email: string | null;
        alamat: string | null;
        sosmed: {
            facebook: string | null;
            instagram: string | null;
            twitter: string | null;
        };
    };
}

const angka = (s: string) => s.replace(/[^\d+]/g, "");

export default function Kontak({ kontak }: Props) {
    const { telepon, whatsapp, email, alamat, sosmed } = kontak;

    const kartu = [
        telepon && {
            icon: Phone,
            judul: "Telepon",
            isi: telepon,
            href: `tel:${angka(telepon)}`,
        },
        whatsapp && {
            icon: MessageCircle,
            judul: "WhatsApp",
            isi: whatsapp,
            href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
            baru: true,
        },
        email && {
            icon: Mail,
            judul: "Email",
            isi: email,
            href: `mailto:${email}`,
        },
        alamat && {
            icon: MapPin,
            judul: "Alamat",
            isi: alamat,
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`,
            baru: true,
        },
    ].filter(Boolean) as {
        icon: typeof Phone;
        judul: string;
        isi: string;
        href: string;
        baru?: boolean;
    }[];

    const media = [
        sosmed.instagram && {
            icon: Instagram,
            nama: "Instagram",
            href: sosmed.instagram,
        },
        sosmed.facebook && {
            icon: Facebook,
            nama: "Facebook",
            href: sosmed.facebook,
        },
        sosmed.twitter && {
            icon: Twitter,
            nama: "Twitter",
            href: sosmed.twitter,
        },
    ].filter(Boolean) as { icon: typeof Phone; nama: string; href: string }[];

    return (
        <PublicAppLayout title="Kontak">
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
                    <p className="eyebrow text-gold">Hubungi Kami</p>
                    <h1 className="mt-4 font-display text-4xl md:text-6xl">
                        Kontak LPPM
                    </h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">
                        Ada pertanyaan seputar penelitian, pengabdian, atau
                        kerja sama? Sekretariat LPPM siap membantu.
                    </p>
                </div>
            </section>

            <section className="section-pad">
                <div className="page-shell">
                    {kartu.length === 0 && media.length === 0 && !alamat ? (
                        <div className="rounded-lg border bg-card px-6 py-16 text-center">
                            <div className="float-soft mx-auto flex size-20 items-center justify-center rounded-full bg-forest text-gold">
                                <Mail className="size-9" />
                            </div>
                            <h2 className="mt-6 font-display text-3xl text-forest">
                                Informasi kontak segera hadir
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Data kontak belum diisi oleh admin.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {kartu.map(
                                    ({
                                        icon: Icon,
                                        judul,
                                        isi,
                                        href,
                                        baru,
                                    }) => (
                                        <a
                                            key={judul}
                                            href={href}
                                            {...(baru
                                                ? {
                                                      target: "_blank",
                                                      rel: "noopener noreferrer",
                                                  }
                                                : {})}
                                            className="lift-card flex flex-col rounded-lg border bg-card p-6"
                                        >
                                            <span className="flex size-12 items-center justify-center rounded-sm bg-forest text-gold">
                                                <Icon className="size-6" />
                                            </span>
                                            <h2 className="mt-5 font-display text-xl text-forest">
                                                {judul}
                                            </h2>
                                            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                                                {isi}
                                            </p>
                                        </a>
                                    ),
                                )}
                            </div>

                            <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
                                {alamat ? (
                                    <div className="overflow-hidden rounded-lg border bg-card">
                                        <iframe
                                            title="Lokasi LPPM di Google Maps"
                                            src={`https://www.google.com/maps?q=${encodeURIComponent(alamat)}&output=embed`}
                                            className="h-96 w-full border-0"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            allowFullScreen
                                        />
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                                            <span className="flex items-start gap-2 text-muted-foreground">
                                                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                                                {alamat}
                                            </span>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-primary hover:text-amber"
                                            >
                                                Buka di Google Maps
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border bg-card p-8 text-muted-foreground">
                                        Alamat belum diisi.
                                    </div>
                                )}

                                <aside className="space-y-6">
                                    <div className="rounded-lg border bg-card p-6">
                                        <h2 className="flex items-center gap-2 font-display text-xl text-forest">
                                            <Clock className="size-5 text-primary" />{" "}
                                            Jam layanan
                                        </h2>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Senin–Jumat, 08.00–16.00 WIB
                                        </p>
                                    </div>

                                    {media.length > 0 && (
                                        <div className="rounded-lg border bg-card p-6">
                                            <h2 className="font-display text-xl text-forest">
                                                Media sosial
                                            </h2>
                                            <ul className="mt-4 space-y-2">
                                                {media.map(
                                                    ({
                                                        icon: Icon,
                                                        nama,
                                                        href,
                                                    }) => (
                                                        <li key={nama}>
                                                            <a
                                                                href={href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted hover:text-primary"
                                                            >
                                                                <Icon className="size-5 text-primary" />{" "}
                                                                {nama}
                                                            </a>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    <Link
                                        href="/"
                                        className="inline-block text-sm font-bold text-primary hover:text-amber"
                                    >
                                        Kembali ke Beranda
                                    </Link>
                                </aside>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </PublicAppLayout>
    );
}
