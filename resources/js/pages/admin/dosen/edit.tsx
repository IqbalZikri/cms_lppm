import { Fakultas } from "@/interface/fakultas";
import { Head } from "@inertiajs/react";
import DosenForm from "./form";
import { route } from "ziggy-js";
import { Dosen } from "@/types/dosen";

export default function Edit({ fakultas, dosen }: { fakultas: Fakultas[], dosen: Dosen }) {
    return (
        <>
            <Head title="Tambah Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DosenForm fakultas={fakultas} dosen={dosen}/>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumb: [{ Label: "Tambah Dosen", href: route("admin.dosen.create") }],
};
