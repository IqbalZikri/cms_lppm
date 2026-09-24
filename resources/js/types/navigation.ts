import { InertiaLinkProps } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps["href"]>;
};

// export type NavItem = {
//     title: string;
//     href: NonNullable<InertiaLinkProps["href"]>;
//     icon?: LucideIcon | null;
//     isActive?: boolean;
//     items?: NavItem[]
// };

type NavItemBase = {
    title: string;
    icon?: LucideIcon;
    isActive?: boolean;
};

// Leaf: bisa diklik langsung → href wajib, tidak boleh punya children
type NavLeafItem = NavItemBase & {
    href: string; // route() dari Ziggy mengembalikan string
    items?: never;
};

// Parent: dropdown → wajib punya children, tidak boleh punya href sendiri
type NavParentItem = NavItemBase & {
    href?: never;
    items: NavLeafItem[];
};

export type NavItem = NavLeafItem | NavParentItem;
