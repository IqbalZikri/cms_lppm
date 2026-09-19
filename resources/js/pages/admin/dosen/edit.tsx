import { Fakultas } from "@/interface/fakultas";
import { Head } from "@inertiajs/react";
import DosenForm from "./form";
import { route } from "ziggy-js";
import { Dosen } from "@/types/dosen";
import { User } from "@/interface/user";

export default function Edit({ fakultas, dosen, user }: { fakultas: Fakultas[], dosen: Dosen, user:User }) {
    return (
        <>
            <Head title="Tambah Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DosenForm fakultas={fakultas} dosen={dosen} user={user}/>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumb: [{ Label: "Tambah Dosen", href: route("admin.dosen.create") }],
};
