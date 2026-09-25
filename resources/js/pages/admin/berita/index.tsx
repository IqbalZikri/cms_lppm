import { DialogDelete, DialogUpdateStatus } from '@/components/dialog-form';
import Header from '@/components/header';
import TablePage from '@/components/table-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Berita } from '@/interface/berita';
import { Kategori } from '@/interface/kategori';
import { PaginatedData } from '@/interface/pagination';
import { Form, Head, Link } from '@inertiajs/react';
import { Newspaper, Plus } from 'lucide-react';
import { route } from 'ziggy-js';

interface BeritaProps {
    data: PaginatedData<Berita>;
    kategori: Kategori[];
    beritaDraft: number;
    beritaPublished: number;
    beritaArchived: number;
}

export default function BeritaPage({
    data,
    kategori,
    beritaDraft,
    beritaPublished,
    beritaArchived,
}: BeritaProps) {
    const statusStyle = {
        draft: 'bg-gray-500 text-white hover:bg-gray-600',
        published: 'bg-green-500 text-white hover:bg-green-600',
        rejected: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <>
            <Head title="Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Berita"
                    breadcrumb={[
                        {
                            label: 'Berita',
                            href: 'admin.berita.index',
                        },
                    ]}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Fakultas */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Berita Status Draft
                            </CardTitle>

                            <Newspaper className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {beritaDraft}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Berita dengan status draft
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Berita Status Published
                            </CardTitle>

                            <Newspaper className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {beritaPublished}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Berita dengan status published
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Berita Status Archived
                            </CardTitle>

                            <Newspaper className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {beritaArchived}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Berita dengan status archived
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                   <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <Newspaper className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>
                                    Daftar Berita
                                </CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi berita yang
                                    terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("admin.berita.create")}
                            viewTransition
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto">
                                <Plus />
                                Tambah Berita
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <TablePage<Berita>
                            data={data}
                            columns={[
                                {
                                    key: 'kategori_id',
                                    label: 'Kategori',
                                    render: (value) =>
                                        kategori.find((k) => k.id === value)
                                            ?.nama_kategori ?? '-',
                                },
                                {
                                    key: 'judul_berita',
                                    label: 'Judul Berita',
                                },
                                {
                                    key: 'views',
                                    label: 'views',
                                },
                                {
                                    key: 'status_published',
                                    label: 'Status',
                                    render: (value: any) => {
                                        return (
                                            <Badge
                                                className={
                                                    statusStyle[
                                                        value as keyof typeof statusStyle
                                                    ]
                                                }
                                            >
                                                {value.charAt(0).toUpperCase() +
                                                    value.slice(1)}
                                            </Badge>
                                        );
                                    },
                                },
                            ]}
                            renderActions={(item) => (
                                <div className="flex items-center gap-2">
                                    <DialogUpdateStatus
                                        actionUrl={route(
                                            'admin.berita.updateStatus',
                                            item.id,
                                        )}
                                        page="Berita"
                                        item={item}
                                        label={item.judul_berita}
                                        status_published={item.status_published}
                                    />
                                    <Link
                                        href={route(
                                            'admin.berita.show',
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="secondary">
                                            Show
                                        </Button>
                                    </Link>
                                    <Link
                                        href={route(
                                            'admin.berita.edit',
                                            item.id,
                                        )}
                                        viewTransition
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <DialogDelete
                                        actionUrl={route(
                                            'admin.berita.destroy',
                                            item.id,
                                        )}
                                        page="berita"
                                        item={item}
                                        label={item.judul_berita}
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

BeritaPage.layout = {
    breadcrumbs: [
        {
            title: 'Berita',
            href: route('admin.berita.index'),
        },
    ],
};
