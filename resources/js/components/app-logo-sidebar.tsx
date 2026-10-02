import { usePage } from "@inertiajs/react";

import AppLogoIconSidebar from "./app-logo-icon-sidebar";

export default function AppLogoSidebar() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <AppLogoIconSidebar className="size-7 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
