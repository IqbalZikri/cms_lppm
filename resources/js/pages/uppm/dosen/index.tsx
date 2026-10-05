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
import { Head, Link, router } from "@inertiajs/react";
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
import { useEffect, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DosenPageProps {
    totalDosen: number;
    totalLaki: number;
    totalPerempuan: number;
    data: PaginatedData<DosenTypes>;
    filters: {
        search?: string;
    };
}

export default function Dosen({
    totalDosen,
    totalLaki,
    totalPerempuan,
    data,
    filters,
}: DosenPageProps) {
    const [search, setSearch] = useState(filters.search ?? "");

    useEffect(() => {
        const sama = search === (filters.search ?? "");

        if (sama) return;

        const timeout = setTimeout(() => {
            router.get(
                route("uppm.dosen.index"),
                {
                    ...(search && { search }),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

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
                                {totalDosen}
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
                                {totalLaki}
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
                                {totalPerempuan}
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
                                <CardTitle>Daftar Dosen</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi dosen yang terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <Field orientation="horizontal">
                                <Input
                                    type="search"
                                    placeholder="Cari Disini..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Field>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TablePage<DosenTypes>
                            data={data}
                            columns={[
                                {
                                    key: "prodi",
                                    label: "Prodi",
                                    render: (value: any) =>
                                        value.nama_prodi ?? "-",
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
                                {
                                    key: "email",
                                    label: "Email",
                                },
                            ]}
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
