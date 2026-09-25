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
import FormLuaranJurnal from "./form";
import { LuaranJurnal } from "@/interface/luaran-jurnal";

interface Props {
    fakultas: Fakultas[];
    data: LuaranJurnal;
}

export default function EditLuaranJurnal({ fakultas, data }: Props) {
    return (
        <>
            <Head title="Tambah Luaran Jurnal" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Data Luaran Jurnal
                        </h1>

                        <p className="mt-1 text-muted-foreground">
                            Form edit data luaran jurnal.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.luaran_jurnal.index")}
                                    >
                                        Luaran Jurnal
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.luaran_jurnal.edit", data.id)}
                                    >
                                        Edit Luaran Jurnal
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormLuaranJurnal fakultas={fakultas} luaranJurnal={data} />
            </div>
        </>
    );
}

EditLuaranJurnal.layout = {
    breadcrumbs: [
        {
            title: "Tambah Penelitian Kegiatan",
        },
    ],
};
