import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fakultas } from "@/interface/fakultas";
import { LuaranProsiding as LuaranProsidingInterface } from "@/interface/luaran-prosiding";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { Plus, ScrollText } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<LuaranProsidingInterface>;
    fakultas: Fakultas[];
}

export default function LuaranProsiding({ data, fakultas }: Props) {
    return (
        <>
            <Head title="Luaran Prosiding" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Luaran Prosiding"
                    breadcrumb={[
                        {
                            label: "Luaran Prosiding",
                            href: "admin.luaran_prosiding.index",
                        },
                    ]}
                />

                {fakultas.map((item) => {
                    const totalLuaranProsiding = data.total;
                    const totalLuaranProsidingFakultas = data.data.filter(
                        (luaranProsiding) =>
                            luaranProsiding.penulis.some(
                                (penulis) => penulis.fakultas_id === item.id,
                            ),
                    );
                    return (
                        <StatisticsCard
                            key={item.id}
                            dataCard={[
                                {
                                    label: "Luaran Prosiding",
                                    count: totalLuaranProsiding,
                                },
                                {
                                    label:
                                        "Luaran Prosiding" + item.nama_fakultas,
                                    count: totalLuaranProsidingFakultas.length,
                                },
                            ]}
                        />
                    );
                })}

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <ScrollText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Luaran Prosiding</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi Luaran Prosiding yang terdaftar
                                    dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href={route("admin.luaran_prosiding.create")}
                            viewTransition
                        >
                            <Button className="mb-[20px]">
                                <Plus />
                                Tambah Penelitian Kegiatan
                            </Button>
                        </Link>
                        <TablePage<LuaranProsidingInterface>
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
                                            <Badge key={i} className="mr-2">
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
                                        href={route(
                                            "admin.luaran_prosiding.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.luaran_prosiding.show",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="default" size="sm">
                                            Show
                                        </Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
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

LuaranProsiding.layouts = {
    breadcrumbs: [
        {
            title: "Luaran Prosiding",
        },
    ],
};
