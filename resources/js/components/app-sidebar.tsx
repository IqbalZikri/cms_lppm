import { Link } from "@inertiajs/react";
import {
    Activity,
    BookOpen,
    BookOpenIcon,
    Building2,
    Database,
    FileBadge,
    FileText,
    FolderGit2,
    GraduationCap,
    HandHeart,
    LayoutGrid,
    Newspaper,
    NewspaperIcon,
    Plus,
    ScrollText,
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
import pkm from "@/routes/dosen/pkm";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: route("admin.dashboard"),
        icon: LayoutGrid,
    },
    {
        title: "Master Data",
        icon: Database,
        items: [
            {
                title: "Fakultas",
                href: route("admin.fakultas.index"),
                icon: Building2,
            },
            {
                title: "Prodi",
                href: route("admin.prodi.index"),
                icon: BookOpenIcon,
            },
            {
                title: "Users Admin & UPPM",
                href: route("admin.user.index"),
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
                href: route("admin.kategori.index"),
                icon: Tags,
            },
            {
                title: "Berita",
                href: route("admin.berita.index"),
                icon: NewspaperIcon,
            },
            {
                title: "Buat Berita",
                href: route("admin.berita.create"),
                icon: Plus,
            },
        ],
    },
    {
        title: "Dosen",
        icon: GraduationCap,
        items: [
            {
                title: "Data Dosen",
                href: route("admin.dosen.index"),
                icon: GraduationCap,
            },
            {
                title: "Tambah Dosen",
                href: route("admin.dosen.create"),
                icon: Plus,
            },
        ],
    },
    {
        title: "Penelitian",
        icon: FileText,
        items: [
            {
                title: "Kegiatan",
                href: route("admin.kegiatan.index"),
                icon: Activity,
            },
            {
                title: "PKM",
                href: route("admin.pkm.index"),
                icon: HandHeart,
            },
            {
                title: "Luaran Prosiding",
                href: route("admin.luaran_prosiding.index"),
                icon: ScrollText,
            },
            {
                title: "HKI",
                href: route("admin.hki.index"),
                icon: FileBadge,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: "Repository",
    //     href: "https://github.com/laravel/react-starter-kit",
    //     icon: FolderGit2,
    // },
    // {
    //     title: "Documentation",
    //     href: "https://laravel.com/docs/starter-kits#react",
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={route("admin.dashboard")}
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
