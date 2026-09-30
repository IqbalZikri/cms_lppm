import { Link } from "@inertiajs/react";
import {
    Activity,
    FileBadge,
    FileText,
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
        href: route("dosen.dashboard"),
        icon: LayoutGrid,
    },
    {
        title: "Penelitian",
        icon: FileText,
        items: [
            {
                title: "Kegiatan",
                href: route("dosen.kegiatan.index"),
                icon: Activity,
            },
            {
                title: "PKM",
                href: route("dosen.pkm.index"),
                icon: HandHeart,
            },
            {
                title: "HKI",
                href: route("dosen.hki.index"),
                icon: FileBadge,
            },
            {
                title: "Luaran Prosiding",
                href: route("dosen.luaran_prosiding.index"),
                icon: ScrollText,
            },
            {
                title: "Luaran Jurnal",
                href: route("dosen.luaran_jurnal.index"),
                icon: Notebook,
            },
        ],
    },
];

export function AppSidebarDosen() {
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
