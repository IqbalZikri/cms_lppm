import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import type { NavItem } from "@/types";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    return (
        <SidebarMenu>
            {items.map((item) => {
                const isParentActive =
                    item.items?.some((subItem) => isCurrentUrl(subItem.href)) ??
                    false;

                if (item.items) {
                    const isOpen =
                        isParentActive || openMenus.includes(item.title);

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
                                                    isActive={isCurrentUrl(
                                                        child.href,
                                                    )}
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
                            isActive={isCurrentUrl(item.href)}
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
