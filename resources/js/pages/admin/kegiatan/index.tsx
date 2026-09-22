import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { Kegiatan as KegiatanInterface } from "@/interface/kegiatan";
import { PaginatedData } from "@/interface/pagination";
import { Dosen } from "@/types/dosen";
import { Head, Link } from "@inertiajs/react";
import { Activity, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<KegiatanInterface>;
    fakultas: Fakultas[];
    dosen: Dosen[];
}

export default function Kegiatan({ data, fakultas, dosen }: Props) {
    const totalKegiatan = data.total;

    return (
        <>
            <Head title="Penelitian Kegiatan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Penelitian Kegiatan"
                    breadcrumb={[
                        {
                            label: "Penelitian Kegiatan",
                            href: "admin.kegiatan.index",
                        },
                    ]}
                />

                {fakultas.map((item) => {
                    const totalKegiatanFakultas = data.data.filter(
                        (d) => d.fakultas_id === item.id,
                    );

                    return (
                        <StatisticsCard
                            key={item.id}
                            dataCard={[
                                {
                                    label: "Kegiatan",
                                    count: totalKegiatan,
                                },
                                {
                                    label:
                                        "Penelitian Kegiatan Fakultas " +
                                        item.nama_fakultas,
                                    count: totalKegiatanFakultas.length ?? 0,
                                },
                            ]}
                        />
                    );
                })}

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <Activity className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Penelitian Kegiatan
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi penelitian kegiatan yang terdaftar
                                    dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href={route("admin.kegiatan.create")}
                            viewTransition
                        >
                            <Button className="mb-[20px]">
                                <Plus />
                                Tambah Penelitian Kegiatan
                            </Button>
                        </Link>
                        <TablePage<KegiatanInterface>
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
                                    key: "dosen_id",
                                    label: "Dosen",
                                    render: (value) =>
                                        dosen.find((d) => d.id === value)
                                            ?.nama_dosen ?? "-",
                                },
                                {
                                    key: "judul_kegiatan",
                                    label: "Judul Kegiatan",
                                },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <Link
                                        href={route(
                                            "admin.kegiatan.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        Edit
                                    </Link>
                                    <DialogDelete
                                        label={item.judul_kegiatan}
                                        actionUrl={route(
                                            "admin.kegiatan.destroy",
                                            item.id,
                                        )}
                                        page="Penelitian Kegiatan"
                                        item={item}
                                    />
                                </>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Kegiatan.layout = {
    breadcrumbs: [
        {
            title: "Penelitian Kegiatan",
            href: route("admin.kegiatan.index"),
        },
    ],
};
