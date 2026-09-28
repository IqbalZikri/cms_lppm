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
import FormLuaranProsiding from "./form";
import { LuaranProsiding } from "@/interface/luaran-prosiding";

interface Props {
    fakultas: Fakultas[];
    data: LuaranProsiding;
}

export default function EditLuaranProsiding({ fakultas, data }: Props) {
    return (
        <>
            <Head title="Edit Luaran Prosiding" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Data Luaran Prosiding
                        </h1>

                        <p className="mt-1 text-muted-foreground">
                            Form edit data luaran prosiding.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.luaran_prosiding.index")}
                                    >
                                        Luaran Prosiding
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.luaran_prosiding.edit", data.id)}
                                    >
                                        Edit Luaran Prosiding
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <FormLuaranProsiding fakultas={fakultas} luaranProsiding={data}/>
            </div>
        </>
    );
}

EditLuaranProsiding.layout = {
    breadcrumbs: [
        {
            title: "Edit Luaran Prosiding",
        },
    ],
};