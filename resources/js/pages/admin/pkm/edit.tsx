import { Head } from "@inertiajs/react";
import FormPkm from "./form";
import { Pkm } from "@/interface/pkm";
import { Fakultas } from "@/types/fakultas";

interface Props {
    data: Pkm;
    fakultas: Fakultas[];
}

export default function EditPkm({ data, fakultas }: Props) {
    return (
        <>
            <Head title="Edit PKM" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FormPkm fakultas={fakultas} pkm={data} />
            </div>
        </>
    );
}

EditPkm.layout = {
    breadcrumbs: [
        {
            title: "Edit PKM",
        },
    ],
};
