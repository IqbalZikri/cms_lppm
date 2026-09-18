import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, CalendarDays, Eye, FileText, User } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Berita } from "@/interface/berita";

interface Props {
    berita: Berita;
}

export default function Show({ berita }: Props) {
    const isPublished = berita.status_published === "published";
    console.log(berita);

    return (
        <>
            <Head title={berita.judul_berita} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={route("admin.berita.index")}>
                                    Berita
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>Detail Berita</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Detail Berita
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap mengenai berita.
                        </p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route("admin.berita.index")} viewTransition>
                            <ArrowLeft />
                            Kembali
                        </Link>
                    </Button>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Article */}
                    <Card>
                        <CardContent className="p-6">
                            {/* Category & Status */}
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    {berita.kategori.nama_kategori}
                                </Badge>

                                <Badge
                                    variant={
                                        isPublished ? "default" : "outline"
                                    }
                                >
                                    {isPublished ? "Published" : "Draft"}
                                </Badge>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold tracking-tight">
                                {berita.judul_berita}
                            </h2>

                            {/* Metadata */}
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="size-4" />

                                    <span>{berita.user.name}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Eye className="size-4" />

                                    <span>
                                        {berita.views.toLocaleString("id-ID")}{" "}
                                        views
                                    </span>
                                </div>

                                {berita.published_at && (
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="size-4" />

                                        <span>
                                            {new Date(
                                                berita.published_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            {berita.gambar && (
                                <div className="mt-6 overflow-hidden rounded-xl border">
                                    <img
                                        src={berita.gambar}
                                        alt={berita.judul_berita}
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Summary */}
                            {berita.ringkasan_berita && (
                                <div className="mt-6 rounded-lg bg-muted/50 p-5">
                                    <div className="mb-2 flex items-center gap-2 font-medium">
                                        <FileText className="size-4" />
                                        Ringkasan
                                    </div>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {berita.ringkasan_berita}
                                    </p>
                                </div>
                            )}

                            {/* Article Content */}
                            <article
                                className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: berita.isi_berita,
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Informasi Berita
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Kategori
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {berita.kategori.nama_kategori}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Status
                                    </p>

                                    <div className="mt-1">
                                        <Badge
                                            variant={
                                                isPublished
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {isPublished
                                                ? "Published"
                                                : "Draft"}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Views
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {berita.views.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Slug
                                    </p>

                                    <p className="mt-1 break-all text-sm">
                                        {berita.slug}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Penulis
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {berita.user.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Dipublikasikan
                                    </p>

                                    <p className="mt-1 text-sm">
                                        {berita.published_at
                                            ? new Date(
                                                  berita.published_at,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "2-digit",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Aksi
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Button className="w-full" asChild>
                                    <Link
                                        href={route(
                                            "admin.berita.edit",
                                            berita.id,
                                        )}
                                    >
                                        Edit Berita
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
