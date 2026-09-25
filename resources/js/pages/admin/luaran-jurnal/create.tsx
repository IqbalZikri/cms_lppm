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
import FormLuaranJurnal from "./form";

interface Props {
    fakultas: Fakultas[];
}

export default function CreateLuaranJurnal({ fakultas }: Props) {
    return (
        <>
            <Head title="Tambah Penelitian Kegiatan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tambah Data Luaran Jurnal
                        </h1>

                        <p className="mt-1 text-muted-foreground">
                            Form tambah data luaran jurnal.
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
                                        href={route("admin.luaran_jurnal.create")}
                                    >
                                        Tambah Luaran Jurnal
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormLuaranJurnal fakultas={fakultas} />
            </div>
        </>
    );
}

CreateLuaranJurnal.layout = {
    breadcrumbs: [
        {
            title: "Tambah Luaran Jurnal",
        },
    ],
};