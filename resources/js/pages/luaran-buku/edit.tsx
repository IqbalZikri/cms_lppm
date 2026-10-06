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
import { LuaranBuku } from "@/interface/luaran-buku";

interface Props {
    fakultas: Fakultas[];
    data: LuaranBuku;
    role: string;
}

export default function editLuaranBuku({ fakultas, data, role }: Props) {
    return (
        <>
            <Head title="Edit Luaran Buku" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Data Luaran Buku
                        </h1>

                        <p className="mt-1 text-muted-foreground">
                            Form edit data luaran buku.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.luaran_buku.index")}
                                    >
                                        Luaran Buku
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route(
                                            "admin.luaran_buku.edit",
                                            data.id,
                                        )}
                                    >
                                        Edit Luaran Buku
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormLuaranBuku
                    fakultas={fakultas}
                    luaranBuku={data}
                    role={role}
                />
            </div>
        </>
    );
}

editLuaranBuku.layout = {
    breadcrumbs: [
        {
            title: "Edit Luaran Buku",
        },
    ],
};
