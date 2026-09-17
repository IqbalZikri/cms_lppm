import { Link } from "@inertiajs/react";
import {
    BookOpen,
    BookOpenIcon,
    Building2,
    ChevronRight,
    CircleArrowRight,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    Newspaper,
    Tags,
    User,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
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
        href: route("dashboard"),
        icon: LayoutGrid,
    },
    {
        title: "Master Data",
        icon: LayoutGrid,
        items: [
            {
                title: "Fakultas",
                href: route("fakultas.index"),
                icon: Building2,
            },
            {
                title: "Prodi",
                href: route("prodi.index"),
                icon: BookOpenIcon,
            },
            {
                title: "Users",
                href: route("user.index"),
                icon: User,
            },
        ],
    },
    {
        title: "Berita",
        icon: Newspaper,
        items: [
            {
                title: "Kategori",
                href: route('kategori.index'),
                icon: Tags
            }
        ]
    },
    {
        title: "Dosen",
        icon: GraduationCap,
        items: [
            {
                title: "Data Dosen",
                href: route("dosen.index"),
                icon: ChevronRight,
            },
            {
                title: "Tambah Dosen",
                href: route("dosen.create"),
                icon: ChevronRight,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={route("dashboard")}
                                prefetch
                                viewTransition
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
