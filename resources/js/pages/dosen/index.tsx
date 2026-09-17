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

interface Dosen {
    id: number;
    fakultas_id: number;
    nidn: number;
    nuptk: number;
    nama_dosen: string;
    jenis_kelamin: string;
    hp: number;
}

interface DosenPageProps {
    data: PaginatedData<Dosen>;
    fakultas: Fakultas[];
}

export default function Dosen({ data, fakultas }: DosenPageProps) {
    const jumlahLakiLaki = data.data.filter(
        (item) => item.jenis_kelamin === "Laki-laki",
    ).length;

    const jumlahPerempuan = data.data.filter(
        (item) => item.jenis_kelamin === "Perempuan",
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
                                    <BreadcrumbLink href={route("dosen.index")}>
                                        Dosen
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <Link href={route("dosen.create")} viewTransition>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Dosen
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Dosen */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Dosen
                            </CardTitle>

                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.total}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Seluruh dosen terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Fakultas */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fakultas
                            </CardTitle>

                            <Building2 className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {fakultas.length}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Fakultas dengan data dosen
                            </p>
                        </CardContent>
                    </Card>

                    {/* Laki-laki */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dosen Laki-laki
                            </CardTitle>

                            <Mars className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {jumlahLakiLaki}
                            </div>

                            <p className="text-xs text-muted-foreground">
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

                            <Venus className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {jumlahPerempuan}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Pada halaman ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Users className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Dosen</CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Informasi dosen yang terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TablePage<Dosen>
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
                                    render: (value) => (
                                        <div className="font-medium">
                                            {value}
                                        </div>
                                    ),
                                },

                                {
                                    key: "jenis_kelamin",
                                    label: "Jenis Kelamin",
                                    render: (value) => (
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
                                    <Link href={route("dosen.edit", item.id)}>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <DialogDelete
                                        actionUrl={route(
                                            "dosen.destroy",
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
            href: route("dosen.index"),
        },
    ],
};
