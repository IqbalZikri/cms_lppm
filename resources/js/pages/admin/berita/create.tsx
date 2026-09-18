// resources/js/Pages/Admin/Berita/Create.tsx
import { Head } from '@inertiajs/react';
import BeritaForm from './form';
import { route } from 'ziggy-js';

interface Kategori {
    id: number;
    nama_kategori: string;
}

export default function Create({ kategoris }: { kategoris: Kategori[] }) {
    return (
        <>
            <Head title="Buat Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <BeritaForm kategoris={kategoris} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Buat Berita',
            href: route('admin.berita.create'),
        },
    ],
};
