import { Head } from "@inertiajs/react";
import BeritaForm from "./form";
import { Berita } from "@/interface/berita";

interface Kategori {
    id: number;
    nama_kategori: string;
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <BeritaForm kategoris={kategoris} berita={berita} />
            </div>
        </>
    );
}
