import { Head } from "@inertiajs/react";
import AppearanceTabs from "@/components/appearance-tabs";
import Heading from "@/components/heading";
import { edit as editAppearance } from "@/routes/appearance";

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="sr-only">Appearance settings</h1>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Appearance settings"
                        description="Update the appearance settings for your account"
                    />
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: "Appearance settings",
            href: editAppearance(),
        },
    ],
};
