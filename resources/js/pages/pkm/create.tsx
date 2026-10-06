import { Fakultas } from "@/types/fakultas";
import { Head } from "@inertiajs/react";
import FormPkm from "../forms/pkm/form";

interface Props {
    fakultas: Fakultas[];
    role: string;
}

export default function CreatePkm({ fakultas, role }: Props) {
    return (
        <>
            <Head title="Tambah PKM" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FormPkm fakultas={fakultas} role={role} />
            </div>
        </>
    );
}

CreatePkm.layout = {
    breadcrumbs: [
        {
            title: "Tambah PKM",
        },
    ],
};
