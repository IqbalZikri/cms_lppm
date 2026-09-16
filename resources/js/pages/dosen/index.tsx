import DialogFormCreate, { DialogFormEdit } from "@/components/dialog-form";
import TablePage from "@/components/table-page";
import { Button } from "@/components/ui/button";
import { PaginatedData } from "@/interface/pagination";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

interface Dosen {
    id: number;
    nidn: number;
    nuptk: number;
    nama_dosen: string;
    jenis_kelamin: string;
    hp: number;
}

interface DosenPageProps {
    data: PaginatedData<Dosen>;
}

export default function Dosen({ data }: DosenPageProps) {
    console.log(data);

    return (
        <>
            <Head title="Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href={route("dosen.create")} viewTransition>
                    <Button>Tambah Dosen</Button>
                </Link>
                <TablePage
                    data={data}
                    columns={[
                        { key: "nidn", label: "NIDN" },
                        { key: "nuptk", label: "NUPTK" },
                        { key: "nama_dosen", label: "Nama Dosen" },
                        { key: "jenis_kelamin", label: "Jenis Kelamin" },
                        { key: "hp", label: "No. Hp" },
                    ]}
                    renderActions={(item) => <></>}
                />
            </div>
        </>
    );
}

Dosen.layout = {
    breadcrumbs: [
        {
            title: "Dosen",
            href: route("dosen.index"),
        },
    ],
};
