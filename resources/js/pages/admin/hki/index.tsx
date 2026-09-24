import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { Hki as HkiInterface} from "@/interface/hki";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { Eye, FileText, Pencil, Plus, ScrollText } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<HkiInterface>;
    fakultas: Fakultas[];
}

export default function Hki({ data, fakultas }: Props) {
    

    return (
        <>
            <Head title="Hak Kekayaan Intelektual" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <Header
                    page="Hak Kekayaan Intelektual"
                    breadcrumb={[
                        {
                            label: "Hak Kekayaan Intelektual",
                            href: "admin.hki.index",
                        },
                    ]}
                />

                <StatisticsCard
                    dataCard={[
                        { label: "Hak Kekayaan Intelektual", count: data.total },
                        // ...statistikFakultas,
                    ]}
                />

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <ScrollText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Hak Kekayaan Intelektual</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi Hak Kekayaan Intelektual yang terdaftar
                                    dalam sistem.
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
                                Tambah Hak Kekayaan Intelektual
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TablePage<HkiInterface>
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
                                // {
                                //     id: "penulis",
                                //     key: "penulis",
                                //     label: "Penulis",
                                //     render: (_, item) => (
                                //         <div className="flex flex-col gap-1.5">
                                //             {item.penulis.map((penulisRelasi, i) => (
                                //                 <div
                                //                     key={i}
                                //                     className="flex flex-wrap items-center gap-1.5"
                                //                 >
                                //                     <Badge className="whitespace-nowrap text-[13px]">
                                //                         {penulis.nama_dosen}
                                //                     </Badge>
                                //                     <span className="text-muted-foreground text-xs text-[13px]">
                                //                         Fakultas{" "}
                                //                         {penulis.nama_fakultas}
                                //                     </span>
                                //                 </div>
                                //             ))}
                                //         </div>
                                //     ),
                                // },
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
                                        href={route(
                                            "admin.hki.show",
                                            item.id,
                                        )}
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
                                        href={route(
                                            "admin.hki.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button
                                            title="Edit"
                                        >
                                            Edit
                                        </Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "admin.hki.destroy",
                                            item.id,
                                        )}
                                        page="HKI"
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

Hki.layouts = {
    breadcrumbs: [
        {
            title: "HKI",
            href: "HKI",
        },
    ],
};
