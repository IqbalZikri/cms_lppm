import { DialogDelete, DialogRestore } from "@/components/dialog-form";
import Header from "@/components/header";
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
import { Kegiatan } from "@/interface/kegiatan";
import { PaginatedData } from "@/interface/pagination";
import { Auth, User } from "@/types";
import { Fakultas } from "@/types/fakultas";
import { Head, Link, router } from "@inertiajs/react";
import { Activity, ArrowLeft, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<Kegiatan>;
    fakultas: Fakultas[];
    filters: {
        search?: string;
        cari_fakultas: string;
    };
    auth: Auth;
}

export default function KegiatanDihapus({
    data,
    fakultas,
    filters,
    auth,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [fakultasId, setFakultasId] = useState(filters.cari_fakultas ?? "");
    

    useEffect(() => {
        const sama =
            search === (filters.search ?? "") &&
            fakultasId === (filters.cari_fakultas ?? "");

        if (sama) return;

        const timeout = setTimeout(() => {
            router.get(
                route("kegiatan.dihapus"),
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
            <Head title="Kegiatan Dihapus" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href={route(auth.user.role + ".kegiatan.index")} viewTransition>
                    <Button>
                        <ArrowLeft />
                        Kembali
                    </Button>
                </Link>
                <Header
                    page="Penelitian Kegiatan yang Dihapus"
                    breadcrumb={[
                        {
                            label: "Penelitian Kegiatan yang Dihapus",
                            href: "kegiatan.dihapus",
                        },
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
                                    Daftar Penelitian Kegiatan yang Dihapus
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi penelitian kegiatan yang dihapus
                                    dalam sistem.
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
                                    placeholder="Cari Disini..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Field>

                            {/* <Link
                                href={route("admin.kegiatan.create")}
                                viewTransition
                                className=""
                            >
                                <Button>
                                    <Plus />
                                    Tambah Penelitian Kegiatan
                                </Button>
                            </Link> */}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<Kegiatan>
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
                                        href={route(`${auth.user.role}.kegiatan.show`, {
                                            kegiatan: item.id,
                                            from: "dihapus",
                                        })}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogRestore
                                        page="Penelitian Kegiatan"
                                        actionUrl={route(
                                            "kegiatan.restore",
                                            item.id,
                                        )}
                                        label={item.judul}
                                        item={item}
                                    />
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "kegiatan.forceDelete",
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

KegiatanDihapus.layout = {
    breadcrumbs: [
        {
            title: "Kegiatan",
        },
        {
            title: "Kegiatan Dihapus",
        },
    ],
};
