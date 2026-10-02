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
import { LuaranProsiding as LuaranProsidingInterface } from "@/interface/luaran-prosiding";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link, router } from "@inertiajs/react";
import { Eye, FileText, Pencil, Plus, ScrollText } from "lucide-react";
import { FormEvent, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<LuaranProsidingInterface>;
    fakultas: Fakultas[];
    filters: any;
    totalLuaranProsidingPerFakultas: string[];
    totalLuaranProsiding: number;
}

export default function LuaranProsiding({
    data,
    filters,
    totalLuaranProsidingPerFakultas,
    totalLuaranProsiding,
}: Props) {
    const statistikFakultas = totalLuaranProsidingPerFakultas.map(
        (item: any) => ({
            label: item.label,
            count: item.count,
        }),
    );

    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.luaran_prosiding.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Luaran Prosiding" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <Header
                    page="Luaran Prosiding"
                    breadcrumb={[
                        {
                            label: "Luaran Prosiding",
                            href: "admin.luaran_prosiding.index",
                        },
                    ]}
                />

                <StatisticsCard
                    dataCard={[
                        {
                            label: "Total Luaran Prosiding",
                            count: totalLuaranProsiding,
                        },
                        ...statistikFakultas,
                    ]}
                />

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <ScrollText className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Luaran Prosiding</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi luaran prosiding yang terdaftar
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
                                href={route("admin.luaran_prosiding.create")}
                                viewTransition
                                className="w-full sm:w-auto"
                            >
                                <Button className="w-full sm:w-auto">
                                    <Plus />
                                    Tambah Luaran Prosiding
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TablePage<LuaranProsidingInterface>
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
                                    id: "fakultas",
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
                                    label: "Penulis",
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
                                            "admin.luaran_prosiding.show",
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
                                            "admin.luaran_prosiding.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button title="Edit">Edit</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "admin.luaran_prosiding.destroy",
                                            item.id,
                                        )}
                                        page="Penelitian Kegiatan"
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

LuaranProsiding.layout = {
    breadcrumbs: [
        {
            title: "Luaran Prosiding",
        },
    ],
};
