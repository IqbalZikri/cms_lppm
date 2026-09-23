import { Head } from "@inertiajs/react";
import FormKegiatan from "./form";
import { Fakultas } from "@/types/fakultas";
import { Kegiatan } from "@/interface/kegiatan";

interface Props {
    fakultas: Fakultas[];
    kegiatan: Kegiatan;
}

export default function EditKegiatan({ fakultas, kegiatan }: Props) {
    return (
        <>
            <Head title="Edit Kegiatan Penelitian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FormKegiatan fakultas={fakultas} kegiatan={kegiatan} />
            </div>
        </>
    );
}

EditKegiatan.layout = {
    breadcrumbs: [
        {
            title: "Edit Penelitian Kegiatan",
        },
    ],
};
