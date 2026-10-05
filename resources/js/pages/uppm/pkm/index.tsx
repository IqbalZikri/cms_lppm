import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaginatedData } from "@/interface/pagination";
import { Pkm } from "@/interface/pkm";
import { Head, Link, router } from "@inertiajs/react";
import { Activity, FileText, HandHeart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<Pkm>;
    filters: {
        search?: string;
    };
}

export default function IndexPkm({ data, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    useEffect(() => {
        const sama = search === (filters.search ?? "");

        if (sama) return;

        const timeout = setTimeout(() => {
            router.get(
                route("uppm.pkm.index"),
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
            <Head title="Pengabdian Kepada Masyarakat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Pengabdian Kepada Masyarakat"
                    breadcrumb={[
                        {
                            label: "Pengabdian Kepada Masyarakat",
                            href: "uppm.pkm.index",
                        },
                    ]}
                />
                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <HandHeart className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Pengabdian Kepada Masyarakat
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi pengabdian kepada masyarakat yang
                                    terdaftar dalam sistem.
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
                                href={route("uppm.pkm.create")}
                                viewTransition
                            >
                                <Button>
                                    <Plus />
                                    Tambah PKM
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TablePage<Pkm>
                            data={data}
                            columns={[
                                {
                                    key: "judul",
                                    label: "Judul PKM",
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
                                                className="mr-2 rounded-md px-2 py-1"
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
                                            <Badge>{item.semester}</Badge>
                                            <Badge variant={"secondary"}>
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
                                        href={route("uppm.pkm.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route("uppm.pkm.show", item.id)}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "uppm.pkm.destroy",
                                            item.id,
                                        )}
                                        page="Penelitian PKM"
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

IndexPkm.layout = {
    breadcrumbs: [
        {
            title: "Penelitian PKM",
        },
    ],
};
