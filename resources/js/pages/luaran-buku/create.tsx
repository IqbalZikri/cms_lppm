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
import FormLuaranBuku from "../forms/luaran-buku/form";

interface Props {
    fakultas: Fakultas[];
    role: string;
}

export default function CreateLuaranBuku({ fakultas, role }: Props) {
    return (
        <>
            <Head title="Tambah Luaran Buku" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tambah Data Luaran Buku
                        </h1>

                        <p className="text-muted-foreground">
                            Form tambah data luaran buku.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route(
                                            role + ".luaran_buku.index",
                                        )}
                                    >
                                        Luaran Buku
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route(
                                            role + ".luaran_buku.create",
                                        )}
                                    >
                                        Tambah Luaran Buku
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormLuaranBuku fakultas={fakultas} role={role} />
            </div>
        </>
    );
}

CreateLuaranBuku.layout = {
    breadcrumbs: [
        {
            title: "Tambah Luaran Buku",
        },
    ],
};
