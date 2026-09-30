import DialogFormCreate, {
    DialogDelete,
    DialogFormEdit,
} from "@/components/dialog-form";
import TablePage from "@/components/table-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { BookOpenIcon } from "lucide-react";
import { route } from "ziggy-js";

interface Prodi {
    id: number;
    fakultas_id: number;
    kode_prodi: number;
    nama_prodi: string;
}

type ProdiPageProps = {
    data: PaginatedData<Prodi>;
};

export default function Prodi({ data }: ProdiPageProps) {
    return (
        <>
            <Head title="Prodi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Prodi
                        </h1>

                        <p className="text-muted-foreground">
                            Kelola dan lihat seluruh data prodi universitas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("uppm.prodi.index")}
                                    >
                                        Prodi
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <BookOpenIcon className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Prodi</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi prodi yang terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<Prodi>
                            data={data}
                            columns={[
                                { key: "kode_prodi", label: "Kode Prodi" },
                                { key: "nama_prodi", label: "Nama Prodi" },
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Prodi.layout = {
    breadcrumbs: [
        {
            title: "Prodi",
            href: route("uppm.prodi.index"),
        },
    ],
};
