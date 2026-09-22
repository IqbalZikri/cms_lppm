import { Fakultas } from "@/types/fakultas";
import { Head } from "@inertiajs/react";

interface Props {
    fakultas: Fakultas[];
}

export default function CreatePkm({ fakultas }: Props) {
    return (
        <>
            <Head title="Tambah Penelitian PKM" />
        </>
    );
}

CreatePkm.layout = {
    breadcrumbs: [
        {
            title: "Tambah Penelitian PKM",
        },
    ],
};
