import { Head } from "@inertiajs/react";
import FormKegiatan from "./form";
import { route } from "ziggy-js";
import { Fakultas } from "@/interface/fakultas";
import { Dosen } from "@/types/dosen";
import Header from "@/components/header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
    fakultas: Fakultas[];
}

export default function CreateKegiatan({ fakultas }: Props) {
    return (
        <>
            <Head title="Tambah Penelitian Kegiatan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tambah Data Penelitian Kegiatan
                        </h1>

                        <p className="text-muted-foreground">
                            Form tambah data penelitian kegiatan.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.kegiatan.index")}
                                    >
                                        Penelitian Kegiatan
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.kegiatan.create")}
                                    >
                                        Tambah Penelitian Kegiatan
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormKegiatan fakultas={fakultas} />
            </div>
        </>
    );
}

CreateKegiatan.layout = {
    breadcrumbs: [
        {
            title: "Tambah Penelitian Kegiatan",
            href: route("admin.kegiatan.create"),
        },
    ],
};
