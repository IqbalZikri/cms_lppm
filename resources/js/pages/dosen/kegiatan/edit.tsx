import { Head } from "@inertiajs/react";
import FormKegiatan from "../../forms/kegiatan/form";
import { Fakultas } from "@/types/fakultas";
import { Kegiatan } from "@/interface/kegiatan";

interface Props {
    fakultas: Fakultas[];
    kegiatan: Kegiatan;
    role: string;
}

export default function EditKegiatan({ fakultas, kegiatan, role }: Props) {
    return (
        <>
            <Head title="Edit Kegiatan Penelitian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FormKegiatan
                    fakultas={fakultas}
                    kegiatan={kegiatan}
                    role={role}
                />
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
