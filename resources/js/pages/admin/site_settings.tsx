import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Head, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";
import { route } from "ziggy-js";

interface Props {
    site_setting: Record<string, string | null>;
}

type TextKey =
    | "nama_website" | "deskripsi_website" | "facebook_url" | "instagram_url"
    | "twitter_url" | "telepon" | "email" | "alamat" | "whatsapp_number"
    | "vision" | "mission";

export default function SiteSettingsPage({ site_setting: s }: Props) {
    const [preview, setPreview] = useState<string | null>(s.logo_url ?? null);

    const { data, setData, post, processing, errors } = useForm({
        _method: "put", // method spoofing: route tetap PUT
        nama_website: s.nama_website ?? "",
        deskripsi_website: s.deskripsi_website ?? "",
        logo_url: null as File | null,
        facebook_url: s.facebook_url ?? "",
        instagram_url: s.instagram_url ?? "",
        twitter_url: s.twitter_url ?? "",
        telepon: s.telepon ?? "",
        email: s.email ?? "",
        alamat: s.alamat ?? "",
        whatsapp_number: s.whatsapp_number ?? "",
        vision: s.vision ?? "",
        mission: s.mission ?? "",
    });

    // helper supaya tidak menulis value/onChange berulang
    const bind = (key: TextKey) => ({
        id: key,
        name: key,
        value: data[key],
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setData(key, e.target.value),
        "aria-invalid": !!errors[key],
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("logo_url", file);
        setPreview(file ? URL.createObjectURL(file) : (s.logo_url ?? null));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.site_setting.update"), {
            forceFormData: true, // wajib untuk upload file
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Site Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    page="Pengaturan Website"
                    breadcrumb={[{ label: "Pengaturan Website", href: "admin.site_setting.index" }]}
                />

                <form onSubmit={submit} className="space-y-4">
                    <Tabs defaultValue="informasi">
                        <TabsList>
                            <TabsTrigger value="informasi">Informasi Website</TabsTrigger>
                            <TabsTrigger value="sosmed">Link Sosial Media</TabsTrigger>
                            <TabsTrigger value="kontak">Kontak & Alamat</TabsTrigger>
                            <TabsTrigger value="visi_misi">Visi & Misi</TabsTrigger>
                        </TabsList>

                        <TabsContent value="informasi">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Website</CardTitle>
                                    <CardDescription>Nama, deskripsi, dan logo website</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="nama_website">Nama Website</FieldLabel>
                                            <Input {...bind("nama_website")} placeholder="Nama Website" />
                                            {errors.nama_website && (
                                                <p className="text-sm text-destructive">{errors.nama_website}</p>
                                            )}
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="deskripsi_website">Deskripsi Website</FieldLabel>
                                            <Textarea {...bind("deskripsi_website")} placeholder="Deskripsi Website" />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="logo_url">Logo Website</FieldLabel>
                                            {preview && (
                                                <img src={preview} alt="Logo" className="h-16 w-16 object-contain" />
                                            )}
                                            <Input
                                                id="logo_url"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                            {errors.logo_url && (
                                                <p className="text-sm text-destructive">{errors.logo_url}</p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="sosmed">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Sosial Media</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        {(["facebook_url", "instagram_url", "twitter_url"] as const).map((key) => (
                                            <Field key={key}>
                                                <FieldLabel htmlFor={key}>
                                                    {key.replace("_url", "").replace(/^./, (c) => c.toUpperCase())}
                                                </FieldLabel>
                                                <Input {...bind(key)} placeholder="https://..." />
                                                {errors[key] && (
                                                    <p className="text-sm text-destructive">{errors[key]}</p>
                                                )}
                                            </Field>
                                        ))}
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="kontak">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Kontak</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="telepon">Nomor Telepon</FieldLabel>
                                            <Input {...bind("telepon")} type="tel" placeholder="021-xxxxxx" />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="whatsapp_number">WhatsApp</FieldLabel>
                                            <Input {...bind("whatsapp_number")} type="tel" placeholder="628xxxxxxxxxx" />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input {...bind("email")} type="email" placeholder="email@example.com" />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
                                            <Textarea {...bind("alamat")} placeholder="Alamat" />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="visi_misi">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visi & Misi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="vision">Visi</FieldLabel>
                                            <Textarea {...bind("vision")} rows={4} />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="mission">Misi (satu poin per baris)</FieldLabel>
                                            <Textarea {...bind("mission")} rows={8} />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Button type="submit" disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </form>
            </div>
        </>
    );
}

SiteSettingsPage.layout = {
    breadcrumbs: [{ title: "Site Settings", href: route("admin.site_setting.index") }],
};