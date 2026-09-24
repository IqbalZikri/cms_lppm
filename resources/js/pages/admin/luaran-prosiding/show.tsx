import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LuaranProsiding as LuaranProsidingInterface } from "@/interface/luaran-prosiding";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    BookText,
    Calendar,
    FileText,
    GraduationCap,
    Pencil,
    ScrollText,
    Users,
} from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    luaranProsiding: LuaranProsidingInterface;
}

export default function ShowLuaranProsiding({ luaranProsiding }: Props) {
    console.log(luaranProsiding.id);
    return (
        <>
            <Head title={luaranProsiding.judul} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <Header
                    page="Luaran Prosiding"
                    breadcrumb={[
                        {
                            label: "Luaran Prosiding",
                            href: "admin.luaran_prosiding.index",
                        },
                        {
                            label: "Detail",
                            href: "admin.luaran_prosiding.show",
                            params: luaranProsiding.id,
                        },
                    ]}
                />

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <ScrollText className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl leading-snug">
                                    {luaranProsiding.judul}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="inline-flex items-center gap-1.5"
                                    >
                                        <Calendar className="h-3 w-3" />
                                        {luaranProsiding.semester}{" "}
                                        {luaranProsiding.tahun}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full gap-2 sm:w-auto">
                            <Link
                                href={route("admin.luaran_prosiding.index")}
                                viewTransition
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <ArrowLeft />
                                    Kembali
                                </Button>
                            </Link>
                            <Link
                                href={route(
                                    "admin.luaran_prosiding.edit",
                                    luaranProsiding.id,
                                )}
                                viewTransition
                                className="w-full sm:w-auto"
                            >
                                <Button className="w-full sm:w-auto">
                                    <Pencil />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 lg:gap-10">
                        {/* Kolom kiri: Abstrak + Berkas */}
                        <div className="space-y-8 lg:col-span-2">
                            <div className="space-y-3">
                                <SectionLabel icon={BookText} title="Abstrak" />
                                <p className="text-base leading-relaxed whitespace-pre-line sm:pl-12">
                                    {luaranProsiding.abstrak}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <SectionLabel
                                    icon={FileText}
                                    title="Berkas Prosiding"
                                />
                                <div className="sm:pl-12">
                                    <a
                                        href={luaranProsiding.link_berkas}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            variant="outline"
                                            className="h-11"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Buka Berkas
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Kolom kanan: Penulis */}
                        <div className="space-y-4 rounded-xl border bg-muted/20 p-5 lg:col-span-1 lg:self-start">
                            <SectionLabel
                                icon={Users}
                                title={`Penulis (${luaranProsiding.penulis.length})`}
                            />

                            <div className="space-y-3">
                                {luaranProsiding.penulis.map((penulis, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 rounded-lg border bg-background p-3"
                                    >
                                        <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                                            <GraduationCap className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {penulis.nama_dosen}
                                            </p>
                                            <p className="text-muted-foreground truncate text-xs">
                                                {penulis.nama_fakultas}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

/** Small inline heading used to label a content section, without the icon-circle used on the form pages. */
function SectionLabel({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <Icon className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
        </div>
    );
}

ShowLuaranProsiding.layouts = {
    breadcrumbs: [
        {
            title: "Detail Luaran Prosiding",
        },
    ],
};
