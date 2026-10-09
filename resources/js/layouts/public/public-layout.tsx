import { useEffect } from "react";
import { toast } from "sonner";
import { Head, usePage } from "@inertiajs/react";
import SiteHeader from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";

interface Flash {
    success?: string;
    error?: string;
}

export default function PublicAppLayout({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const { flash } = usePage<{ flash?: Flash }>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="public-theme min-h-screen">
            <Head title={`${title} | LPPM UCA`} />
            <SiteHeader />
            {children}
            <SiteFooter />
        </div>
    );
}
