import { Fakultas } from "@/types/fakultas";
import { Head } from "@inertiajs/react";
import FormPkm from "../../forms/pkm/form";

interface Props {
    fakultas: Fakultas[];
}

export default function CreatePkm({ fakultas }: Props) {
    return (
        <>
            <Head title="Tambah Penelitian PKM" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FormPkm fakultas={fakultas} />
            </div>
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
