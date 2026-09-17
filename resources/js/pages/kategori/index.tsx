import DialogFormCreate, {
    DialogDelete,
    DialogFormEdit,
} from "@/components/dialog-form";
import TablePage from "@/components/table-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Kategori } from "@/interface/kategori";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { Plus, Tags } from "lucide-react";
import { route } from "ziggy-js";

interface KategoriPageProps {
    data: PaginatedData<Kategori>;
}

export default function KategoriPage({ data }: KategoriPageProps) {
    return (
        <>
            <Head title="Kategori Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Kategori Berita
                        </h1>

                        <p className="text-muted-foreground">
                            Kelola dan lihat seluruh data kategori berita.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("kategori.index")}
                                    >
                                        Kategori
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <DialogFormCreate
                            actionUrl="kategori.store"
                            kolomInput={[
                                {
                                    label: "Nama Kategori",
                                    name: "nama_kategori",
                                    placeholder: "Nama Kategori",
                                    required: true,
                                },
                            ]}
                            page="Kategori Berita"
                        />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Tags className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Kategori Berita</CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Informasi kategori berita yang terdaftar
                                    dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TablePage<Kategori>
                            data={data}
                            columns={[
                                {
                                    key: "nama_kategori",
                                    label: "Nama Kategori",
                                },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <DialogFormEdit
                                        actionUrl={route(
                                            "kategori.update",
                                            item.id,
                                        )}
                                        page="Kategori Berita"
                                        item={item}
                                        kolomInput={[
                                            {
                                                label: "Nama Kategori",
                                                name: "nama_kategori",
                                                placeholder: "Nama Kategori",
                                                required: true,
                                            },
                                        ]}
                                    />
                                    <DialogDelete
                                        actionUrl={route(
                                            "kategori.destroy",
                                            item.id,
                                        )}
                                        page="kategori"
                                        item={item}
                                        label={item.nama_kategori}
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

KategoriPage.layout = {
    breadcrumbs: [
        {
            title: "Kategori Berita",
            href: route("kategori.index"),
        },
    ],
};
