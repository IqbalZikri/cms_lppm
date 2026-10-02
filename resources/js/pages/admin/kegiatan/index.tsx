import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Fakultas } from "@/interface/fakultas";
import { Kegiatan as KegiatanInterface } from "@/interface/kegiatan";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link, router } from "@inertiajs/react";
import { Activity, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<KegiatanInterface>;
    filters: any;
    totalKegiatanPerFakultas: any;
    totalKegiatan: number;
}

export default function Kegiatan({
    data,
    filters,
    totalKegiatanPerFakultas,
    totalKegiatan,
}: Props) {

    const statistikFakultas = totalKegiatanPerFakultas.map((item: any) => ({
        label: item.label,
        count: item.count,
    }));

    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.kegiatan.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

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

                <StatisticsCard
                    dataCard={[
                        {
                            label: "Kegiatan",
                            count: totalKegiatan,
                        },
                        ...statistikFakultas,
                    ]}
                />

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
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

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-3 mb-[10px] xl:mb-[0px]"
                            >
                                <Field orientation="horizontal">
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <Button type="submit">Cari</Button>
                                </Field>
                            </form>

                            <Link
                                href={route("admin.kegiatan.create")}
                                viewTransition
                                className=""
                            >
                                <Button>
                                    <Plus />
                                    Tambah Penelitian Kegiatan
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<KegiatanInterface>
                            data={data}
                            columns={[
                                {
                                    key: "judul",
                                    label: "Judul Kegiatan",
                                },
                                {
                                    id: "fakuktas",
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
                                                        {
                                                            penulis.fakultas
                                                                .nama_fakultas
                                                        }
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                },
                                {
                                    id: "dosen",
                                    key: "penulis",
                                    label: "Dosen",
                                    render: (_, item) => (
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.penulis.map((penulis, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-wrap items-center gap-1.5"
                                                >
                                                    <Badge className="whitespace-nowrap text-[13px]">
                                                        {
                                                            penulis.dosen
                                                                .nama_dosen
                                                        }
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ),
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
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.kegiatan.show",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
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

Kegiatan.layout = {
    breadcrumbs: [
        {
            title: "Penelitian Kegiatan",
            href: route("admin.kegiatan.index"),
        },
    ],
};
