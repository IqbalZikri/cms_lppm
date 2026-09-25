import TablePage from "@/components/table-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fakultas } from "@/interface/fakultas";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    GraduationCap,
    Mars,
    Plus,
    Venus,
    Users,
} from "lucide-react";
import { route } from "ziggy-js";
import { DialogDelete } from "@/components/dialog-form";
import { Prodi } from "@/interface/prodi";
import { Dosen as DosenTypes } from "@/types/dosen";

interface DosenPageProps {
    data: PaginatedData<DosenTypes>;
    fakultas: Fakultas[];
    prodi: Prodi[]
}

export default function Dosen({ data, fakultas, prodi }: DosenPageProps) {
    const jumlahLakiLaki = data.data.filter(
        (item) => item.jenis_kelamin === "L",
    ).length;

    const jumlahPerempuan = data.data.filter(
        (item) => item.jenis_kelamin === "P",
    ).length;
    

    return (
        <>
            <Head title="Dosen" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Dosen
                        </h1>

                        <p className="text-muted-foreground">
                            Kelola dan lihat seluruh data dosen universitas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.dosen.index")}
                                    >
                                        Dosen
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Dosen */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Dosen
                            </CardTitle>

                            <GraduationCap className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.total}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Seluruh dosen terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Laki-laki */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dosen Laki-laki
                            </CardTitle>

                            <Mars className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {jumlahLakiLaki}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Pada halaman ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Perempuan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dosen Perempuan
                            </CardTitle>

                            <Venus className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {jumlahPerempuan}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Pada halaman ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Dosen
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi dosen yang
                                    terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("admin.hki.create")}
                            viewTransition
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto">
                                <Plus />
                                Tambah Dosen
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardContent>
                        <TablePage<DosenTypes>
                            data={data}
                            columns={[
                                {
                                    key: "fakultas_id",
                                    label: "Fakultas",
                                    render: (value) =>
                                        fakultas.find((f) => f.id === value)
                                            ?.nama_fakultas ?? "-",
                                },
                                {
                                    key: "prodi_id",
                                    label: "Prodi",
                                    render: (value) =>
                                        prodi.find((p) => p.id === value)
                                            ?.nama_prodi ?? "-",
                                },
                                {
                                    key: "nidn",
                                    label: "NIDN",
                                },

                                {
                                    key: "nuptk",
                                    label: "NUPTK",
                                },

                                {
                                    key: "nama_dosen",
                                    label: "Nama Dosen",
                                    render: (value: any) => (
                                        <div className="font-medium">
                                            {value}
                                        </div>
                                    ),
                                },

                                {
                                    key: "jenis_kelamin",
                                    label: "Jenis Kelamin",
                                    render: (value: any) => (
                                        <Badge
                                            variant={
                                                value === "Laki-laki"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {value}
                                        </Badge>
                                    ),
                                },

                                {
                                    key: "hp",
                                    label: "No. HP",
                                },
                            ]}
                            renderActions={(item) => (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route(
                                            "admin.dosen.edit",
                                            item.id,
                                        )}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.dosen.show",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="default" size="sm">
                                            Show
                                        </Button>
                                    </Link>
                                    <DialogDelete
                                        actionUrl={route(
                                            "admin.dosen.destroy",
                                            item.id,
                                        )}
                                        page="dosen"
                                        item={item}
                                        label={item.nama_dosen}
                                    />
                                </div>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dosen.layout = {
    breadcrumbs: [
        {
            title: "Dosen",
            href: route("admin.dosen.index"),
        },
    ],
};
