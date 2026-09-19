import {
    ArrowLeft,
    CalendarDays,
    Edit,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import { Head, Link } from "@inertiajs/react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dosen } from "@/types/dosen";
import { route } from "ziggy-js";

interface Props {
    dosen: Dosen;
}

export default function Show({ dosen }: Props) {
    return (
        <>
            <Head title={`Dosen - ${dosen.nama_dosen}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dosen">Dosen</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>{dosen.nama_dosen}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Detail Dosen
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Informasi lengkap mengenai dosen.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.dosen.index')} viewTransition>
                                <ArrowLeft />
                                Kembali
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href={`/dosen/${dosen.id}/edit`}>
                                <Edit />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Profile */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Foto */}
                            <div className="flex justify-center md:justify-start">
                                <div className="bg-muted h-40 w-40 overflow-hidden rounded-xl border">
                                    {dosen.foto ? (
                                        <img
                                            src={dosen.foto}
                                            alt={`Foto ${dosen.nama_dosen}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                            <User className="size-16" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Identitas utama */}
                            <div className="flex-1 space-y-3 text-center md:text-left">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {dosen.nama_dosen}
                                    </h2>

                                    <p className="text-muted-foreground">
                                        {dosen.nidn
                                            ? `NIDN: ${dosen.nidn}`
                                            : "NIDN belum tersedia"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 text-sm md:flex-row md:flex-wrap">
                                    <div>
                                        <span className="font-medium">
                                            Fakultas:
                                        </span>{" "}
                                        {dosen.fakultas?.nama_fakultas ?? "-"}
                                    </div>

                                    <div>
                                        <span className="font-medium">
                                            Program Studi:
                                        </span>{" "}
                                        {dosen.prodi?.nama_prodi ?? "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Data Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Kepegawaian</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow label="NIDN" value={String(dosen.nidn)} />

                            <Separator />

                            <InfoRow
                                label="NUPTK"
                                value={String(dosen.nuptk)}
                            />

                            <Separator />

                            <InfoRow
                                label="Fakultas"
                                value={dosen.fakultas?.nama_fakultas}
                            />

                            <Separator />

                            <InfoRow
                                label="Kode Fakultas"
                                value={dosen.fakultas?.kode_fakultas}
                            />

                            <Separator />

                            <InfoRow
                                label="Program Studi"
                                value={dosen.prodi?.nama_prodi}
                            />

                            <Separator />

                            <InfoRow
                                label="Kode Program Studi"
                                value={String(dosen.prodi?.kode_prodi)}
                            />
                        </CardContent>
                    </Card>

                    {/* Data Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow
                                label="Nama Lengkap"
                                value={dosen.nama_dosen}
                            />

                            <Separator />

                            <InfoRow
                                label="Jenis Kelamin"
                                value={dosen.jenis_kelamin}
                            />

                            <Separator />

                            <InfoRow
                                label="Tempat Lahir"
                                value={dosen.tempat_lahir}
                            />

                            <Separator />

                            <InfoRow
                                label="Tanggal Lahir"
                                value={formatTanggal(dosen.tanggal_lahir)}
                            />

                            <Separator />

                            <div className="flex gap-3">
                                <MapPin className="text-muted-foreground mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Alamat
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.alamat ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <Phone className="text-muted-foreground mt-0.5 size-5" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Nomor HP
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.hp ?? "-"}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-3">
                                <Mail className="text-muted-foreground mt-0.5 size-5" />

                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {dosen.email ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Akun */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Akun Pengguna</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <InfoRow
                                label="Nama User"
                                value={dosen.user?.name}
                            />

                            <Separator />

                            <InfoRow
                                label="Email User"
                                value={dosen.user?.email}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

interface InfoRowProps {
    label: string;
    value?: string | null;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">{label}</p>

            <p className="text-sm font-medium">{value ?? "-"}</p>
        </div>
    );
}

function formatTanggal(tanggal?: string | null) {
    if (!tanggal) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(tanggal));
}
