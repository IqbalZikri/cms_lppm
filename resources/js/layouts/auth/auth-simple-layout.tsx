import { Link, usePage } from "@inertiajs/react";
import { home } from "@/routes";
import type { AuthLayoutProps } from "@/types";
import DSC06368 from "@/../../public/images/DSC06368.jpg";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { url } = usePage();

    const isLoginOrRegister =
        url.startsWith("/login") || url.startsWith("/register");

    const inputStyle = [
        // Input, textarea, dan select: putih solid + border jelas
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:rounded-xl",
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:border-stone-300",
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:bg-white",
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:text-stone-800",
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:shadow-sm",
        "[&_:is(input,textarea)]:placeholder:text-stone-400",

        // Fokus
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:focus-visible:border-[#4E7C66]",
        "[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:focus-visible:ring-[#4E7C66]/25",

        // Disabled (mis. prodi sebelum fakultas dipilih): abu solid, bukan transparan
        "[&_:is(input,textarea,[data-slot=select-trigger]):disabled]:bg-stone-100",
        "[&_:is(input,textarea,[data-slot=select-trigger]):disabled]:opacity-100",
        "[&_:is(input,textarea,[data-slot=select-trigger]):disabled]:text-stone-400",

        // Dark mode: card tetap krem, jadi tetap putih
        "dark:[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:bg-white",
        "dark:[&_:is(input,textarea,[data-slot=select-trigger]):not([type=checkbox],[type=radio])]:text-stone-800",

        // Bulatan radio
        "[&_[role=radio]]:border-stone-400 [&_[role=radio]]:bg-white",

        // Label & link
        "[&_label]:text-stone-700",
        "[&_a]:text-[#4E7C66] [&_a:hover]:text-[#3A6350]",
    ].join(" ");

    return (
        <div
            className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-cover bg-center p-6 md:p-10"
            style={{ backgroundImage: `url(${DSC06368})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-black/30 to-emerald-950/60" />

            <div
                className={`relative z-10 w-full ${
                    url.startsWith("/login") ? "max-w-md" : "max-w-xl"
                }`}
            >
                <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-[#FBF6E9]/95 py-0 text-stone-800 shadow-2xl ring-1 ring-[#E8DCC0] backdrop-blur-md">
                    {/* Header band: hijau tua + garis emas (warna dari logo) */}
                    <div className="border-b-4 border-[#C0A062] bg-gradient-to-br from-[#052E1C] to-[#0B5A3C] px-6 py-6 md:px-8">
                        <Link href={home()} className="block">
                            <div className="relative mx-auto aspect-[1600/582] w-full max-w-[360px]">
                                {/* Lingkaran putih di belakang ikon (area ikon = tinggi logo) */}
                                <div className="absolute left-0 top-0 aspect-square h-full rounded-full bg-white shadow-lg" />
                                <img
                                    src="/images/logo_uca_putih.png"
                                    alt="Universitas Cendekia Abditama"
                                    className="relative h-full w-full object-contain"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>
                    </div>

                    {/* Judul + form */}
                    <div className="space-y-1.5 px-6 pt-6 text-center md:px-8">
                        <h1 className="text-2xl font-bold tracking-tight text-[#0B4A2F]">
                            {title}
                        </h1>
                        <p className="text-sm text-stone-600">{description}</p>
                    </div>

                    <CardContent
                        className={`px-6 pb-8 pt-6 md:px-8 ${isLoginOrRegister ? inputStyle : ""}`}
                    >
                        {children}
                    </CardContent>
                </Card>

                <p className="mt-5 text-center text-xs text-white/75">
                    © {new Date().getFullYear()} Universitas Cendekia Abditama
                </p>
            </div>
        </div>
    );
}
