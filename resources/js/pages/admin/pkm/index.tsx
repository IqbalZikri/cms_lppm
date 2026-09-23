import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { PaginatedData } from "@/interface/pagination";
import { Pkm as PkmInterface } from "@/interface/pkm";
import { Head, Link } from "@inertiajs/react";
import { HandHeart, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<PkmInterface>;
    fakultas: Fakultas[];
}

export default function Pkm({ data, fakultas }: Props) {
    return (
        <>
            <Head title="Pengabdian Kepaga Masyarakat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Pengabdian Kepada Masyarakat"
                    breadcrumb={[
                        {
                            label: "PKM",
                            href: "admin.pkm.index",
                        },
                    ]}
                />
                {fakultas.map((item) => {
                    const totalPkmFakultas = data.data.filter((pkm) =>
                        pkm.penulis.some(
                            (penulis) => penulis.fakultas_id === item.id,
                        ),
                    );
                    return (
                        <StatisticsCard
                            key={item.id}
                            dataCard={[
                                {
                                    label: "Total PKM",
                                    count: data.total,
                                },
                                {
                                    label:
                                        "Total PKM Fakultas" +
                                        item.nama_fakultas,
                                    count: totalPkmFakultas.length,
                                },
                            ]}
                        />
                    );
                })}

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <HandHeart className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Penelitian Pengabdian Kepada
                                    Masyarakat
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi penelitian pengabdian kepada
                                    masyarakat yang terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Link href={route("admin.pkm.create")} viewTransition>
                            <Button className="mb-[20px]">
                                <Plus />
                                Tambah Penelitian PKM
                            </Button>
                        </Link>
                        <TablePage<PkmInterface>
                            data={data}
                            columns={[
                                {
                                    id: "fakultas",
                                    key: "penulis",
                                    label: "Fakultas",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge key={i} className="mr-2">
                                                {penulis.nama_fakultas}
                                            </Badge>
                                        )),
                                },
                                {
                                    id: "dosen",
                                    key: "penulis",
                                    label: "Dosen",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge
                                                key={i}
                                                className="mr-2 rounded-md px-2 py-1 text-xs"
                                            >
                                                {penulis.nama_dosen}
                                            </Badge>
                                        )),
                                },
                                {
                                    key: "judul",
                                    label: "Judul",
                                },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <Link
                                        href={route("admin.pkm.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button variant={"outline"}>Edit</Button>
                                    </Link>
                                    <Link
                                        href={route("admin.pkm.show", item.id)}
                                        viewTransition
                                    >
                                        <Button>Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "admin.pkm.destroy",
                                            item.id,
                                        )}
                                        page="Penelitian Pengabdian Kepada Masyarakat"
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

Pkm.layout = {
    breadcrumbs: [
        {
            title: "Pengabdian Kepada Masyarakat",
        },
    ],
};
