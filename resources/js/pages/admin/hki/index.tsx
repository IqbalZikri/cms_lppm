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
import { Fakultas } from "@/interface/fakultas";
import { Hki as HkiInterface } from "@/interface/hki";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link, router } from "@inertiajs/react";
import { FileBadge, FileText, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<HkiInterface>;
    fakultas: Fakultas[];
    filters: {
        search?: string;
        cari_fakultas?: string;
    };
    totalHkiPerFakultas: string[];
    totalHki: number;
}

export default function Hki({
    data,
    fakultas,
    filters,
    totalHkiPerFakultas,
    totalHki,
}: Props) {
    const statistikFakultas = totalHkiPerFakultas.map((item: any) => ({
        label: item.label,
        count: item.count,
    }));

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
                route("admin.hki.index"),
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
                        {
                            label: "Hak Kekayaan Intelektual",
                            count: totalHki,
                        },
                        ...statistikFakultas,
                    ]}
                />

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <FileBadge className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Hak Kekayaan Intelektual
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi Hak Kekayaan Intelektual yang
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

                            <Field orientation={"horizontal"}>
                                <Input
                                    type="search"
                                    placeholder="Cari Disini..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Field>

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
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TablePage<HkiInterface>
                            data={data}
                            columns={[
                                {
                                    key: "jenis_hki",
                                    label: "Jenis HKI",
                                    render: (_, item) => (
                                        <Badge
                                            variant={
                                                item.jenis_hki === "paten"
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {item.jenis_hki &&
                                                item.jenis_hki.toUpperCase()}
                                        </Badge>
                                    ),
                                },
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
                                                        {penulis
                                                            ? penulis.fakultas
                                                                  .nama_fakultas
                                                            : "-"}
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
                                                        {penulis.dosen
                                                            .nama_dosen ?? "-"}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ),
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
                                        <>
                                            {item.link_berkas ? (
                                                <a
                                                    href={item.link_berkas}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    Lihat
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    id: "status_pengajuan",
                                    key: "status_pengajuan",
                                    label: "Status Pengajuan",
                                    render: (_, item) => {
                                        const statusPengajuan =
                                            item.status_pengajuan
                                                .charAt(0)
                                                .toUpperCase() +
                                            item.status_pengajuan.slice(1);
                                        return (
                                            <Badge
                                                variant={
                                                    item.status_pengajuan ===
                                                    "draft"
                                                        ? "default"
                                                        : item.status_pengajuan ===
                                                            "diajukan"
                                                          ? "secondary"
                                                          : item.status_pengajuan ===
                                                              "disetujui"
                                                            ? "success"
                                                            : "destructive"
                                                }
                                            >
                                                {statusPengajuan}
                                            </Badge>
                                        );
                                    },
                                },
                            ]}
                            renderActions={(item) => (
                                <div className="flex items-center gap-3">
                                    {item.status_pengajuan === "draft" ? (
                                        ""
                                    ) : (
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
                                    )}
                                    {item.status_pengajuan === "diajukan" ||
                                    item.status_pengajuan === "disetujui" ? (
                                        ""
                                    ) : (
                                        <Link
                                            href={route(
                                                "admin.hki.edit",
                                                item.id,
                                            )}
                                            viewTransition
                                        >
                                            <Button title="Edit">Edit</Button>
                                        </Link>
                                    )}
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

Hki.layout = {
    breadcrumbs: [
        {
            title: "Hak Kekayaan Intelektual",
        },
    ],
};
