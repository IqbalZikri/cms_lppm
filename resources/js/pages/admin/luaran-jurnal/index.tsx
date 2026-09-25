import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { LuaranJurnal as LuaranJurnalInterface } from "@/interface/luaran-jurnal";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { FileText, Notebook, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<LuaranJurnalInterface>;
    fakultas: Fakultas[];
}

export default function LuaranJurnal({ data, fakultas }: Props) {
    const statistikFakultas = fakultas.map((item) => ({
        label: item.nama_fakultas,
        count: data.data.filter((luaran_jurnal) =>
            luaran_jurnal.penulis.some(
                (penulis) => penulis.fakultas_id === item.id,
            ),
        ).length,
    }));

    return (
        <>
            <Head title="Luaran Jurnal" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <Header
                    page="Luaran Jurnal"
                    breadcrumb={[
                        {
                            label: "Luaran Jurnal",
                            href: "admin.hki.index",
                        },
                    ]}
                />

                <StatisticsCard
                    dataCard={[
                        {
                            label: "Luaran Jurnal",
                            count: data.total,
                        },
                        ...statistikFakultas,
                    ]}
                />

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <Notebook className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Luaran Jurnal</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi luaran jurnal yang terdaftar dalam
                                    sistem.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("admin.luaran_jurnal.create")}
                            viewTransition
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto">
                                <Plus />
                                Tambah Luaran Jurnal
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TablePage<LuaranJurnalInterface>
                            data={data}
                            columns={[
                                {
                                    id: "judul",
                                    key: "judul",
                                    label: "Judul",
                                    render: (_, item) => (
                                        <span
                                            className="line-clamp-2 max-w-xs font-medium"
                                            title={item.judul}
                                        >
                                            {item.judul}
                                        </span>
                                    ),
                                },
                                {
                                    id: "penulis",
                                    key: "penulis",
                                    label: "Fakultas",
                                    render: (_, item) => (
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.penulis.map((penulis, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-wrap items-center gap-1.5"
                                                >
                                                    <Badge className="whitespace-nowrap text-[13px]">
                                                        {penulis.nama_fakultas}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                },
                                {
                                    id: "penulis",
                                    key: "penulis",
                                    label: "Penulis",
                                    render: (_, item) => (
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.penulis.map((penulis, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-wrap items-center gap-1.5"
                                                >
                                                    <Badge className="whitespace-nowrap text-[13px]">
                                                        {penulis.nama_dosen}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                },
                                {
                                    id: "periode",
                                    key: "semester",
                                    label: "Periode",
                                    render: (_, item) => (
                                        <span className="whitespace-nowrap text-sm">
                                            {item.semester} {item.tahun}
                                        </span>
                                    ),
                                },
                                {
                                    id: "berkas",
                                    key: "link_berkas",
                                    label: "Berkas",
                                    render: (_, item) => (
                                        <a
                                            href={item.link_berkas}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            Lihat
                                        </a>
                                    ),
                                },
                            ]}
                            renderActions={(item) => (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route("admin.luaran_jurnal.show", item.id)}
                                        viewTransition
                                    >
                                        <Button
                                            variant="outline"
                                            title="Lihat detail"
                                        >
                                            Show
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route("admin.luaran_jurnal.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button title="Edit">Edit</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "admin.luaran_jurnal.destroy",
                                            item.id,
                                        )}
                                        page="luaran jurnal"
                                        item={item}
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

LuaranJurnal.layout = {
    breadcrumbs: [
        {
            title: "Luaran Jurnal",
        },
    ],
};
