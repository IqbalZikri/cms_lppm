import DialogFormCreate, {
    DialogDelete,
    DialogFormEdit,
} from "@/components/dialog-form";
import TablePage from "@/components/table-page";
import { PaginatedData } from "@/interface/pagination";
import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";

interface Prodi {
    id: number;
    fakultas_id: number;
    kode_prodi: number;
    nama_prodi: string;
}

interface Fakultas {
    id: number;
    kode_fakultas: string;
    nama_fakultas: string;
}

type ProdiPageProps = {
    data: PaginatedData<Prodi>;
    fakultas: Fakultas[];
};

export default function Prodi({ data, fakultas }: ProdiPageProps) {
    return (
        <>
            <Head title="Prodi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DialogFormCreate
                    page="Prodi"
                    actionUrl="prodi.store"
                    kolomInput={[
                        {
                            name: "fakultas_id",
                            label: "Fakultas",
                            type: "select",
                            // required: true,
                            options: fakultas.map((f) => ({
                                value: f.id,
                                label: f.nama_fakultas,
                            })),
                        },
                        {
                            name: "kode_prodi",
                            label: "Kode Prodi",
                            type: "text",
                            required: true,
                            placeholder: "Kode Prodi",
                            autoComplete: "off",
                        },
                        {
                            name: "nama_prodi",
                            label: "Nama Prodi",
                            // required: true,
                            placeholder: "Nama Prodi",
                        },
                    ]}
                />
                <TablePage<Prodi>
                    data={data}
                    columns={[
                        {
                            key: "fakultas_id",
                            label: "Fakultas",
                            render: (value) =>
                                fakultas.find((f) => f.id === value)
                                    ?.nama_fakultas ?? "-",
                        },
                        { key: "kode_prodi", label: "Kode Prodi" },
                        { key: "nama_prodi", label: "Nama Prodi" },
                    ]}
                    renderActions={(item) => (
                        <>
                            <DialogFormEdit
                                page="Prodi"
                                actionUrl={route("prodi.update", item.id)}
                                item={item}
                                kolomInput={[
                                    {
                                        name: "fakultas_id",
                                        label: "Fakultas",
                                        type: "select",
                                        required: true,
                                        options: fakultas.map((f) => ({
                                            value: f.id,
                                            label: f.nama_fakultas,
                                        })),
                                    },
                                    {
                                        name: "kode_prodi",
                                        label: "Kode Prodi",
                                        required: true,
                                    },
                                    {
                                        name: "nama_prodi",
                                        label: "Nama Prodi",
                                        required: true,
                                    },
                                ]}
                            />
                            <DialogDelete
                                page="Prodi"
                                actionUrl={route("prodi.destroy", item.id)}
                                item={item}
                                label={item.nama_prodi}
                            />
                        </>
                    )}
                />
            </div>
        </>
    );
}

Prodi.layout = {
    breadcrumbs: [
        {
            title: "Prodi",
            href: route("prodi.index"),
        },
    ],
};
