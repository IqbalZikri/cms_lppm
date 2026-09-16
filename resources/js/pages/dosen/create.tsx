import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { UserRound, Contact, ArrowLeft, Save } from "lucide-react";
import { Dosen } from "@/types/dosen";

export default function CreateDosen() {
    const { errors } = useForm<Dosen>();
    console.log(errors);
    
    return (
        <>
            <Head title="Tambah Dosen" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <UserRound className="size-5 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Tambah Dosen
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Tambahkan data dosen baru ke dalam sistem.
                            </p>
                        </div>
                    </div>
                </div>

                <Form
                    action={route("dosen.store")}
                    method="POST"
                    className="mx-auto w-full max-w-5xl space-y-6"
                >
                    {/* Identitas Dosen */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserRound className="size-5" />
                                Identitas Dosen
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Masukkan informasi identitas dan nomor
                                registrasi dosen.
                            </p>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                {/* NIDN */}
                                <Field>
                                    <FieldLabel htmlFor="nidn">NIDN</FieldLabel>

                                    <Input
                                        id="nidn"
                                        name="nidn"
                                        placeholder="Contoh: 0123456789"
                                    />

                                    <p className="text-xs text-muted-foreground">
                                        Nomor Induk Dosen Nasional.
                                    </p>

                                    {errors.nidn && (
                                        <p className="text-sm text-red-500">
                                            {errors.nidn}
                                        </p>
                                    )}
                                </Field>

                                {/* NUPTK */}
                                <Field>
                                    <FieldLabel htmlFor="nuptk">
                                        NUPTK
                                    </FieldLabel>

                                    <Input
                                        id="nuptk"
                                        name="nuptk"
                                        placeholder="Contoh: 1234567890123456"
                                    />

                                    <p className="text-xs text-muted-foreground">
                                        Nomor Unik Pendidik dan Tenaga
                                        Kependidikan.
                                    </p>
                                </Field>

                                {/* Nama */}
                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="nama_dosen">
                                        Nama Dosen
                                    </FieldLabel>

                                    <Input
                                        id="nama_dosen"
                                        name="nama_dosen"
                                        placeholder="Masukkan nama lengkap dosen"
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Informasi Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Contact className="size-5" />
                                Informasi Pribadi
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Masukkan informasi pribadi dosen.
                            </p>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                {/* Jenis Kelamin */}
                                <Field>
                                    <FieldLabel htmlFor="jenis_kelamin">
                                        Jenis Kelamin
                                    </FieldLabel>

                                    <Select name="jenis_kelamin">
                                        <SelectTrigger id="jenis_kelamin">
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="L">
                                                Laki-laki
                                            </SelectItem>

                                            <SelectItem value="P">
                                                Perempuan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* Tempat Lahir */}
                                <Field>
                                    <FieldLabel htmlFor="tempat_lahir">
                                        Tempat Lahir
                                    </FieldLabel>

                                    <Input
                                        id="tempat_lahir"
                                        name="tempat_lahir"
                                        placeholder="Contoh: Tangerang"
                                    />
                                </Field>

                                {/* Tanggal Lahir */}
                                <Field>
                                    <FieldLabel htmlFor="tanggal_lahir">
                                        Tanggal Lahir
                                    </FieldLabel>

                                    <Input
                                        id="tanggal_lahir"
                                        name="tanggal_lahir"
                                        type="date"
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Informasi Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Contact className="size-5" />
                                Informasi Kontak
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Masukkan informasi kontak dan alamat dosen.
                            </p>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                {/* HP */}
                                <Field>
                                    <FieldLabel htmlFor="hp">
                                        Nomor HP
                                    </FieldLabel>

                                    <Input
                                        id="hp"
                                        name="hp"
                                        type="tel"
                                        placeholder="Contoh: 081234567890"
                                    />
                                </Field>

                                {/* Alamat */}
                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="alamat">
                                        Alamat
                                    </FieldLabel>

                                    <Textarea
                                        id="alamat"
                                        name="alamat"
                                        placeholder="Masukkan alamat lengkap dosen"
                                        className="min-h-28 resize-none"
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Action */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link href={route("dosen.index")}>
                            <Button type="button" variant="outline">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>

                        <Button type="submit">
                            <Save className="size-4" />
                            Simpan Dosen
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}

CreateDosen.layout = {
    breadcrumbs: [
        {
            title: "Form Tambah Dosen",
            href: route("dosen.create"),
        },
    ],
};
