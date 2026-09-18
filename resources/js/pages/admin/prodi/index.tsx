import DialogFormCreate, {
    DialogDelete,
    DialogFormEdit,
} from '@/components/dialog-form';
import TablePage from '@/components/table-page';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginatedData } from '@/interface/pagination';
import { Head, Link } from '@inertiajs/react';
import { BookOpenIcon } from 'lucide-react';
import { route } from 'ziggy-js';

interface Prodi {
    id: number;
    fakultas_id: number;
    kode_prodi: number;
    nama_prodi: string;
}

interface Fakultas {
    id: number;
    kode_fakultas: string;
    nama_fakultas: string;
}

type ProdiPageProps = {
    data: PaginatedData<Prodi>;
    fakultas: Fakultas[];
};

export default function Prodi({ data, fakultas }: ProdiPageProps) {
    return (
        <>
            <Head title="Prodi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Prodi
                        </h1>

                        <p className="text-muted-foreground">
                            Kelola dan lihat seluruh data prodi universitas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route('admin.prodi.index')}
                                    >
                                        Prodi
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <BookOpenIcon className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Prodi</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi prodi yang terdaftar dalam sistem.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DialogFormCreate
                            page="Prodi"
                            actionUrl="admin.prodi.store"
                            kolomInput={[
                                {
                                    name: 'fakultas_id',
                                    label: 'Fakultas',
                                    type: 'select',
                                    // required: true,
                                    options: fakultas.map((f) => ({
                                        value: f.id,
                                        label: f.nama_fakultas,
                                    })),
                                },
                                {
                                    name: 'kode_prodi',
                                    label: 'Kode Prodi',
                                    type: 'text',
                                    required: true,
                                    placeholder: 'Kode Prodi',
                                    autoComplete: 'off',
                                },
                                {
                                    name: 'nama_prodi',
                                    label: 'Nama Prodi',
                                    // required: true,
                                    placeholder: 'Nama Prodi',
                                },
                            ]}
                        />
                        <TablePage<Prodi>
                            data={data}
                            columns={[
                                {
                                    key: 'fakultas_id',
                                    label: 'Fakultas',
                                    render: (value) =>
                                        fakultas.find((f) => f.id === value)
                                            ?.nama_fakultas ?? '-',
                                },
                                { key: 'kode_prodi', label: 'Kode Prodi' },
                                { key: 'nama_prodi', label: 'Nama Prodi' },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <DialogFormEdit
                                        page="Prodi"
                                        actionUrl={route(
                                            'admin.prodi.update',
                                            item.id,
                                        )}
                                        item={item}
                                        kolomInput={[
                                            {
                                                name: 'fakultas_id',
                                                label: 'Fakultas',
                                                type: 'select',
                                                required: true,
                                                options: fakultas.map((f) => ({
                                                    value: f.id,
                                                    label: f.nama_fakultas,
                                                })),
                                            },
                                            {
                                                name: 'kode_prodi',
                                                label: 'Kode Prodi',
                                                required: true,
                                            },
                                            {
                                                name: 'nama_prodi',
                                                label: 'Nama Prodi',
                                                required: true,
                                            },
                                        ]}
                                    />
                                    <DialogDelete
                                        page="Prodi"
                                        actionUrl={route(
                                            'admin.prodi.destroy',
                                            item.id,
                                        )}
                                        item={item}
                                        label={item.nama_prodi}
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

Prodi.layout = {
    breadcrumbs: [
        {
            title: 'Prodi',
            href: route('admin.prodi.index'),
        },
    ],
};
