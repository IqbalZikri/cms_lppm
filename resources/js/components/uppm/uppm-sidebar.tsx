import { Link } from "@inertiajs/react";
import {
    Activity,
    BookOpen,
    Building,
    FileBadge,
    FilePenLine,
    FileText,
    GraduationCap,
    HandHeart,
    LayoutGrid,
    Notebook,
    ScrollText,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";
import { route } from "ziggy-js";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: route("uppm.dashboard"),
        icon: LayoutGrid,
        exact: true,
    },
    {
        title: "Prodi",
        href: route("uppm.prodi.index"),
        icon: BookOpen,
    },
    {
        title: "Dosen",
        href: route("uppm.dosen.index"),
        icon: GraduationCap,
    },
    {
        title: "Penelitian",
        icon: FileText,
        items: [
            {
                title: "Kegiatan",
                href: route("uppm.kegiatan.index"),
                icon: Activity,
            },
            {
                title: "PKM",
                href: route("uppm.pkm.index"),
                icon: HandHeart,
            },
            {
                title: "Luaran Prosiding",
                href: route("uppm.luaran_prosiding.index"),
                icon: ScrollText,
            },
            {
                title: "Luaran Jurnal",
                href: route("uppm.luaran_jurnal.index"),
                icon: Notebook,
            },
        ],
    },
    {
        title: "Pengajuan",
        icon: FilePenLine,
        items: [
            {
                title: "HKI",
                href: route("uppm.hki.index"),
                icon: FileBadge,
            },
        ],
    },
];

export function AppSidebarUppm() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="bg-[#bf9f62]"
                        >
                            <Link
                                href={route("dosen.dashboard")}
                                prefetch
                                viewTransition
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="text-[#ffff]">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
