import type { BreadcrumbItem } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import DosenSidebarLayout from "../app/dosen/dosen-sidebar-layout";

interface Flash {
    success?: string;
    error?: string;
}

export default function DosenAppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { flash } = usePage<{ flash?: Flash }>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("theme-uca");
        return () => root.classList.remove("theme-uca");
    }, []);
    return (
        <DosenSidebarLayout breadcrumbs={breadcrumbs}>
            {children}
            <Toaster richColors position="top-right" />
        </DosenSidebarLayout>
    );
}
