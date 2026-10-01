import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Kegiatan } from "@/interface/kegiatan";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { Activity, FileText, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    kegiatan: PaginatedData<Kegiatan>;
}

export default function IndexKegiatan({ kegiatan }: Props) {
    console.log(kegiatan);
    
    return (
        <>
            <Head title="Kegiatan Penelitian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Penelitian Kegiatan"
                    breadcrumb={[
                        {
                            label: "Penelitian Kegiatan",
                            href: "uppm.kegiatan.index",
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

                        <Link
                            href={route("uppm.kegiatan.create")}
                            viewTransition
                        >
                            <Button className="mb-[20px]">
                                <Plus />
                                Tambah Penelitian Kegiatan
                            </Button>
                        </Link>
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
                                            <Badge key={i} className="mr-2">
                                                {penulis.fakultas.nama_fakultas}
                                            </Badge>
                                        )),
                                },
                                {
                                    id: "uppm",
                                    key: "penulis",
                                    label: "uppm",
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
                                        href={route(
                                            "uppm.kegiatan.edit",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            "uppm.kegiatan.show",
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "uppm.kegiatan.destroy",
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
