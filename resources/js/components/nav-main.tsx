import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

function getPath(href: string): string {
    return new URL(href, "http://localhost").pathname;
}

export function NavMain({ items }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const isActivePath = (href: string) => {
        const target = getPath(href);
        const current = new URL(currentUrl, "http://localhost").pathname;

        return current === target || current.startsWith(target + "/");
    };

    // Buka otomatis parent yang berisi halaman aktif setiap kali halaman berpindah
    useEffect(() => {
        const activeParents = items
            .filter((i) => i.items?.some((s) => isActivePath(s.href)))
            .map((i) => i.title);

        setOpenMenus((prev) => [...new Set([...prev, ...activeParents])]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUrl]);

    return (
        <SidebarMenu>
            {items.map((item) => {
                if (item.items) {
                    const isParentActive = item.items.some((subItem) =>
                        isActivePath(subItem.href),
                    );
                    const isOpen = openMenus.includes(item.title);

                    // Jika ada beberapa submenu yang cocok, tandai hanya yang paling spesifik
                    const activeChildHref = item.items
                        .filter((s) => isActivePath(s.href))
                        .sort(
                            (a, b) =>
                                getPath(b.href).length - getPath(a.href).length,
                        )[0]?.href;

                    return (
                        <Collapsible
                            key={item.title}
                            open={isOpen}
                            onOpenChange={(open) => {
                                setOpenMenus((prev) => {
                                    if (open) {
                                        return prev.includes(item.title)
                                            ? prev
                                            : [...prev, item.title];
                                    }

                                    return prev.filter(
                                        (title) => title !== item.title,
                                    );
                                });
                            }}
                            asChild
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: item.title,
                                        }}
                                        isActive={isParentActive}
                                        className="my-[3px]"
                                    >
                                        {item.icon && <item.icon />}

                                        <span>{item.title}</span>

                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                                    <SidebarMenu className="border-sidebar-border ml-4 border-l pl-2">
                                        {item.items.map((child) => (
                                            <SidebarMenuItem key={child.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={
                                                        child.href ===
                                                        activeChildHref
                                                    }
                                                    className="transition-colors duration-150"
                                                >
                                                    <Link
                                                        href={child.href}
                                                        prefetch
                                                        viewTransition
                                                    >
                                                        {child.icon && (
                                                            <child.icon />
                                                        )}

                                                        <span>
                                                            {child.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActivePath(item.href)}
                            tooltip={{
                                children: item.title,
                            }}
                        >
                            <Link href={item.href} prefetch viewTransition>
                                {item.icon && <item.icon />}

                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
