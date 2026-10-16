// resources/js/layouts/role-layout.tsx
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";
import AdminLayout from "@/layouts/admin/app-layout";            // sesuaikan path
import DosenAppLayout from "@/layouts/dosen/dosen-layout"; // sesuaikan path
import UppmAppLayout from "@/layouts/uppm/uppm-layout";    // sesuaikan path

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}

export default function RoleLayout({ breadcrumbs = [], children }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;

    const Layout =
        {
            admin: AdminLayout,
            dosen: DosenAppLayout,
            uppm: UppmAppLayout,
        }[auth.user.role] ?? AdminLayout;

    return <Layout breadcrumbs={breadcrumbs}>{children}</Layout>;
}