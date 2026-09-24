import { route } from "ziggy-js";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

interface BreadCrumbPage {
    label: string;
    href: string;
    params?: string | number | Record<string, string | number>;
}

interface HeaderPageProps {
    page: string;
    breadcrumb: BreadCrumbPage[];
}

export default function Header({ page, breadcrumb }: HeaderPageProps) {
    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Data {page}
                    </h1>

                    <p className="text-muted-foreground">
                        Kelola dan lihat seluruh data {page.toLowerCase()}.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumb.length === 1 ? (
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route(
                                            breadcrumb[0].href,
                                            breadcrumb[0].params,
                                        ).toString()}
                                    >
                                        {breadcrumb[0].label}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            ) : (
                                breadcrumb.map((item, index) => (
                                    <React.Fragment key={item.label}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href={route(
                                                    item.href,
                                                    item.params,
                                                ).toString()}
                                            >
                                                {item.label}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>

                                        {index < breadcrumb.length - 1 && (
                                            <BreadcrumbSeparator />
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </>
    );
}
