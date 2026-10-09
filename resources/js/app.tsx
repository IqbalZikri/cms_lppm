import { createInertiaApp } from "@inertiajs/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeTheme } from "@/hooks/use-appearance";
import AppLayout from "@/layouts/admin/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import SettingsLayout from "@/layouts/settings/layout";
import DosenAppLayout from "./layouts/dosen/dosen-layout";
import UppmAppLayout from "./layouts/uppm/uppm-layout";

const appName = "Lembaga Penjamin dan Pengabdian Masyarakat";

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === "welcome":
                return null;
            case name.startsWith("public/"):
                return null;
            case name.startsWith("auth/"):
                return AuthLayout;
            case name.startsWith("settings/"):
                return [AppLayout, SettingsLayout];
            case name.startsWith("dosen/"):
                return DosenAppLayout;
            case name.startsWith("uppm/"):
                return UppmAppLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: "#4B5563",
    },
});

// This will set light / dark mode on load...
initializeTheme();
