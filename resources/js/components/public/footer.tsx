import { Link, usePage } from "@inertiajs/react";
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Twitter,
    Youtube,
} from "lucide-react";
import { Button } from "../ui/button";
import { SharedData } from "@/interface/siteData";

export function SiteFooter() {
    const { site } = usePage<SharedData>().props;

    const sosmed = [
        { label: "Instagram", icon: Instagram, url: site.instagram },
        { label: "Facebook", icon: Facebook, url: site.facebook },
        { label: "Twitter", icon: Twitter, url: site.twitter },
        {
            label: "WhatsApp",
            icon: MessageCircle,
            url: site.whatsapp ? `https://wa.me/${site.whatsapp}` : null,
        },
    ].filter((s) => s.url);
    return (
        <footer className="bg-ink text-primary-foreground">
            <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-sm bg-background p-1">
                            <img
                                src="/images/logo_uca.png"
                                alt="Logo UCA"
                                className="h-14 w-14 object-contain"
                            />
                        </div>
                        <div>
                            <strong className="font-display text-xl">
                                LPPM UCA
                            </strong>
                            <p className="text-xs uppercase tracking-widest text-primary-foreground/55">
                                Universitas Cendekia Abditama
                            </p>
                        </div>
                    </div>
                    <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/65">
                        Menghubungkan ilmu pengetahuan, inovasi, dan kebutuhan
                        masyarakat untuk menghadirkan perubahan yang bermakna.
                    </p>
                </div>
                <div>
                    <h3 className="font-display text-lg">Akses Cepat</h3>
                    <div className="mt-4 grid gap-2 text-sm text-primary-foreground/65">
                        <Link href="/penelitian" className="hover:text-gold">
                            Data Penelitian
                        </Link>
                        <Link href="/publikasi" className="hover:text-gold">
                            Repositori Publikasi
                        </Link>
                        <Link href="/berita" className="hover:text-gold">
                            Berita & Agenda
                        </Link>
                        <Link href="/kontak" className="hover:text-gold">
                            Hubungi LPPM
                        </Link>
                    </div>
                </div>
                <div>
                    <h3 className="font-display text-lg">Sekretariat LPPM</h3>
                    <div className="mt-4 space-y-3 text-sm text-primary-foreground/65">
                        <p className="flex gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                            {site.alamat ??
                                "Jl. Islamic Raya, Klp. Dua, Kecamatan Kelapa Dua, Kabupaten Tangerang, Banten 15811"}
                        </p>
                        <p className="flex gap-2">
                            <Mail className="size-4 shrink-0 text-gold" />
                            <a
                                href={`mailto:${site.email}`}
                                className="hover:text-gold"
                            >
                                {site.email ?? "info@uca.ac.id"}
                            </a>
                        </p>
                        <p className="flex gap-2">
                            <Phone className="size-4 shrink-0 text-gold" />
                            <a
                                href={`tel:${site.telepon}`}
                                className="hover:text-gold"
                            >
                                {site.telepon ?? "+6285810279040"}
                            </a>
                        </p>
                    </div>

                    {sosmed.length > 0 && (
                        <div className="mt-5 flex gap-2">
                            {sosmed.map(({ label, icon: Icon, url }) => (
                                <Button
                                    key={label}
                                    asChild
                                    size="icon"
                                    variant="outline"
                                    className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    <a
                                        href={url!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                    >
                                        <Icon />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="border-t border-primary-foreground/10">
                <div className="page-shell flex flex-col gap-2 py-5 text-xs text-primary-foreground/45 md:flex-row md:justify-between">
                    <span>© 2026 LPPM Universitas Cendekia Abditama.</span>
                </div>
            </div>
        </footer>
    );
}
