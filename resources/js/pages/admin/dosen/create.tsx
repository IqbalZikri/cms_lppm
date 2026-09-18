import { Fakultas } from "@/interface/fakultas";
import { Head } from "@inertiajs/react";
import DosenForm from "./form";
import { route } from "ziggy-js";

export default function Create({ fakultas }: { fakultas: Fakultas[] }) {
    return (
        <>
            <Head title="Tambah Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DosenForm fakultas={fakultas} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumb: [{ Label: "Tambah Dosen", href: route("admin.dosen.create") }],
};
