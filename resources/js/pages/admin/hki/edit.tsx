import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Fakultas } from "@/interface/fakultas";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Hki } from "@/interface/hki";
import FormHki from "./form";

interface Props {
    fakultas: Fakultas[];
    data: Hki;
}

export default function EditHki({ fakultas, data }: Props) {
    return (
        <>
            <Head title="Tambah Penelitian Kegiatan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Data Hak Kekayaan Intelektual
                        </h1>

                        <p className="mt-1 text-muted-foreground">
                            Form edit data Hak Kekayaan Intelektual.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.hki.index")}
                                    >
                                        Hak Kekayaan Intelektual
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.hki.edit", data.id)}
                                    >
                                        Edit Hak Kekayaan Intelektual
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormHki fakultas={fakultas} hki={data}/>
            </div>
        </>
    );
}

EditHki.layout = {
    breadcrumbs: [
        {
            title: "Tambah Penelitian Kegiatan",
        },
    ],
};