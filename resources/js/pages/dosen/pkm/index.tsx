import { DialogDelete } from "@/components/dialog-form";
import Header from "@/components/header";
import TablePage from "@/components/table-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginatedData } from "@/interface/pagination";
import { Pkm } from "@/interface/pkm";
import { Head, Link } from "@inertiajs/react";
import { Activity, FileText, HandHeart, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    data: PaginatedData<Pkm>;
}

export default function IndexPkm({ data }: Props) {
    return (
        <>
            <Head title="Pengabdian Kepada Masyarakat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Penelitian Kegiatan"
                    breadcrumb={[
                        {
                            label: "Pengabdian Kepada Masyarakat",
                            href: "dosen.kegiatan.index",
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

                        <Link href={route("dosen.pkm.create")} viewTransition>
                            <Button className="mb-[20px]">
                                <Plus />
                                Tambah PKM
                            </Button>
                        </Link>
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
                                        href={route("dosen.pkm.edit", item.id)}
                                        viewTransition
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route("dosen.pkm.show", item.id)}
                                        viewTransition
                                    >
                                        <Button variant="default">Show</Button>
                                    </Link>
                                    <DialogDelete
                                        label={item.judul}
                                        actionUrl={route(
                                            "dosen.pkm.destroy",
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
