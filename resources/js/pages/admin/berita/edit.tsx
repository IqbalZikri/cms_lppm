import { Head } from "@inertiajs/react";
import BeritaForm from "./form";

interface Kategori {
    id: number;
    nama_kategori: string;
}

interface Berita {
    id: number;
    kategori_id: number;
    judul_berita: string;
    slug: string;
    ringkasan_berita: string;
    isi_berita: string;
    status_published: boolean;
    published_at: string | null;
    gambar: string | null;
}

export default function Edit({
    kategoris,
    berita,
}: {
    kategoris: Kategori[];
    berita: Berita;
}) {
    return (
        <>
            <Head title="Edit Berita" />
            <div className="max-w-3xl mx-auto py-8 px-4">
                <BeritaForm kategoris={kategoris} berita={berita} />
            </div>
        </>
    );
}
