import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import StatisticsCard from "@/components/statistic-card";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginatedData } from "@/interface/pagination";
import { Pkm as PkmInterface } from "@/interface/pkm";
import { Fakultas } from "@/types/fakultas";
import { Head, Link, router } from "@inertiajs/react";
import { FileText, HandHeart, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { route } from "ziggy-js";

interface Stats {
    total: number;
    perFakultas: { label: string; count: number }[];
}

interface Props {
    data: PaginatedData<PkmInterface>;
    fakultas: Fakultas[];
    filters: {
        search?: string;
        cari_fakultas?: string;
    };
    stats: Stats | null;
}

export default function Pkm({ data, fakultas, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [fakultasId, setFakultasId] = useState(filters.cari_fakultas ?? "");

    useEffect(() => {
        const sama =
            search === (filters.search ?? "") &&
            fakultasId === (filters.cari_fakultas ?? "");

        // tidak ada perubahan, jangan request (ini yang menjaga page tetap)
        if (sama) return;

        const timeout = setTimeout(() => {
            router.get(
                route("pkm.index"),
                {
                    ...(search && { search }),
                    ...(fakultasId && { cari_fakultas: fakultasId }),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, fakultasId]);

    return (
        <>
            <Head title="Pengabdian Kepaga Masyarakat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Pengabdian Kepada Masyarakat"
                    breadcrumb={[
                        {
                            label: "PKM",
                            href: "pkm.index",
                        },
                    ]}
                />
                {stats && (
                    <StatisticsCard
                        dataCard={[
                            { label: "Pengabdian Kepada Masyarakat", count: stats.total },
                            ...stats.perFakultas,
                        ]}
                    />
                )}

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <HandHeart className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Pengabdian Kepada Masyarakat ( PKM )
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi pengabdian kepada masyarakat yang
                                    terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <Select
                                value={fakultasId || "all"}
                                onValueChange={(value) =>
                                    setFakultasId(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Cari Fakultas..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">
                                            Semua Fakultas
                                        </SelectItem>
                                        {fakultas.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.nama_fakultas}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Field orientation="horizontal">
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Field>

                            <Link
                                href={route("pkm.dihapus")}
                                className="w-full sm:w-auto"
                                viewTransition
                            >
                                <Button variant={"destructive"}>
                                    PKM yang Dihapus
                                </Button>
                            </Link>

                            <Link
                                href={route("pkm.create")}
                                viewTransition
                                className="w-full sm:w-auto"
                            >
                                <Button className="w-full sm:w-auto">
                                    <Plus />
                                    Tambah PKM
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<PkmInterface>
                            data={data}
                            columns={[
                                {
                                    key: "judul",
                                    label: "Judul",
                                },
                                {
                                    id: "fakultas",
                                    key: "penulis",
                                    label: "Fakultas",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge key={i} className="mr-2">
                                                {penulis.fakultas.nama_fakultas}
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
                                                {penulis.dosen.nama_dosen}
                                            </Badge>
                                        )),
                                },
                                {
                                    id: "penulis_luar",
                                    key: "penulis_luar",
                                    label: "Penulis Luar Universitas",
                                    render: (_, item) => (
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.penulis_luar.length !== 0 ? (
                                                <>
                                                    {item.penulis_luar.map(
                                                        (penulis, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex flex-wrap items-center gap-1.5"
                                                            >
                                                                <Badge
                                                                    className="whitespace-nowrap text-[13px]"
                                                                    variant={
                                                                        "outline"
                                                                    }
                                                                >
                                                                    {
                                                                        penulis.nama_universitas
                                                                    }
                                                                </Badge>
                                                                <Badge className="whitespace-nowrap text-[13px]">
                                                                    {
                                                                        penulis.nama_dosen
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        ),
                                                    )}
                                                </>
                                            ) : (
                                                <>-</>
                                            )}
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
                                <>
                                    <Link
                                        href={route("pkm.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button variant={"outline"}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route("pkm.show", {
                                            pkm: item.id,
                                            from: "index",
                                        })}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "pkm.destroy",
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
