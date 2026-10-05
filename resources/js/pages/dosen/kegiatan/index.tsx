import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kegiatan } from "@/interface/kegiatan";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link, router } from "@inertiajs/react";
import { Activity, FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    kegiatan: PaginatedData<Kegiatan>;
    filters: {
        search?: string;
    };
}

export default function IndexKegiatan({ kegiatan, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    useEffect(() => {
        const sama = search === (filters.search ?? "");

        if (sama) return;

        const timeout = setTimeout(() => {
            router.get(
                route("dosen.kegiatan.index"),
                {
                    ...(search && { search }),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Kegiatan Penelitian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Penelitian Kegiatan"
                    breadcrumb={[
                        {
                            label: "Penelitian Kegiatan",
                            href: "dosen.kegiatan.index",
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
                                    Daftar Penelitian Kegiatan
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi penelitian kegiatan yang terdaftar
                                    dalam sistem.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <Field orientation="horizontal">
                                <Input
                                    type="search"
                                    placeholder="Cari Disini..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Field>

                            <Link
                                href={route("dosen.kegiatan.create")}
                                viewTransition
                            >
                                <Button>
                                    <Plus />
                                    Tambah Penelitian Kegiatan
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<Kegiatan>
                            data={kegiatan}
                            columns={[
                                {
                                    key: "judul",
                                    label: "Judul Kegiatan",
                                },
                                {
                                    id: "fakultas",
                                    key: "penulis",
                                    label: "Fakultas",
                                    render: (_, item) =>
                                        item.penulis.map((penulis, i) => (
                                            <Badge
                                                key={i}
                                                className="mr-2 text-base"
                                            >
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
                                                className="mr-2 rounded-md px-2 py-1 text-base"
                                            >
                                                {penulis.dosen.nama_dosen}
                                            </Badge>
                                        )),
                                },
                                {
                                    id: "periode",
                                    key: "semester",
                                    label: "Periode",
                                    render: (_, item) => (
                                        <div className="flex flex-wrap gap-4">
                                            <Badge className="text-base">
                                                {item.semester}
                                            </Badge>
                                            <Badge
                                                variant={"secondary"}
                                                className="text-base"
                                            >
                                                {item.tahun}
                                            </Badge>
                                        </div>
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
                                        href={route(
                                            "dosen.kegiatan.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            "dosen.kegiatan.show",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "dosen.kegiatan.destroy",
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

IndexKegiatan.layout = {
    breadcrumbs: [
        {
            title: "Penelitian Kegiatan",
        },
    ],
};
