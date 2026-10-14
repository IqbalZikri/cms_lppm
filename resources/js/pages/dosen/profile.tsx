import { Head, useForm } from "@inertiajs/react";
import { CheckCircle2, Loader2, Save, Upload } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dosen } from "@/types/dosen";

type DosenProfile = {
    id: number;
    sintaid: string | null;
    nidn: string | null;
    nuptk: string | null;
    nama_dosen: string | null;
    pendidikan_terakhir: string | null;
    jabatan_fungsional: string | null;
    gelar_depan: string | null;
    gelar_belakang: string | null;
    jenis_kelamin: "L" | "P" | null;
    tanggal_lahir: string | null;
    tempat_lahir: string | null;
    alamat: string | null;
    hp: string | null;
    email: string | null;
    fakultas: string | null;
    prodi: string | null;
    foto: string | null;
};

type FieldProps = {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
};

function Field({
    id,
    label,
    error,
    required,
    className,
    children,
}: FieldProps) {
    return (
        <div className={`flex flex-col gap-2 ${className ?? ""}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export default function EditProfile({ dosen }: { dosen: DosenProfile }) {
    const [preview, setPreview] = useState<string | null>(dosen.foto);
    const [saved, setSaved] = useState(false);

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "put",
        sintaid: dosen.sintaid ?? "",
        nidn: dosen.nidn ?? "",
        nuptk: dosen.nuptk ?? "",
        nama_dosen: dosen.nama_dosen ?? "",
        pendidikan_terakhir: dosen.pendidikan_terakhir ?? "",
        jabatan_fungsional: dosen.jabatan_fungsional ?? "",
        gelar_depan: dosen.gelar_depan ?? "",
        gelar_belakang: dosen.gelar_belakang ?? "",
        jenis_kelamin: dosen.jenis_kelamin ?? "",
        tanggal_lahir: dosen.tanggal_lahir ?? "",
        tempat_lahir: dosen.tempat_lahir ?? "",
        alamat: dosen.alamat ?? "",
        hp: dosen.hp ?? "",
        email: dosen.email ?? "",
        foto: null as File | null,
    });

    function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData("foto", file);
        if (file) setPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaved(false);

        post(route("dosen.profile.updateProfileDosen", dosen.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setData("foto", null);
            },
        });
    }

    const initials = (data.nama_dosen || "D")
        .split(" ")
        .slice(0, 2)
        .map((s) => s[0])
        .join("")
        .toUpperCase();

    return (
        <>
            <Head title="Edit Profil" />
            <form
                onSubmit={handleSubmit}
                className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
            >
                {saved && (
                    <Alert>
                        <CheckCircle2 />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>
                            Profil berhasil diperbarui.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Foto */}
                <Card>
                    <CardHeader>
                        <CardTitle>Foto profil</CardTitle>
                        <CardDescription>
                            Format JPG, PNG, atau WebP. Maksimal 2 MB.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Avatar className="size-24">
                            <AvatarImage
                                src={preview ?? undefined}
                                alt={data.nama_dosen}
                            />
                            <AvatarFallback className="text-xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="foto"
                                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                            >
                                <Upload className="size-4" />
                                Pilih foto
                            </Label>
                            <Input
                                id="foto"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFoto}
                                className="hidden"
                            />
                            {errors.foto && (
                                <p className="text-sm text-destructive">
                                    {errors.foto}
                                </p>
                            )}
                            {progress && (
                                <p className="text-xs text-muted-foreground">
                                    Mengunggah {progress.percentage}%
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Identitas akademik */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data akademik</CardTitle>
                        <CardDescription>
                            Fakultas dan program studi hanya bisa diubah oleh
                            admin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Field id="fakultas" label="Fakultas">
                            <Input
                                id="fakultas"
                                value={dosen.fakultas ?? "-"}
                                disabled
                                readOnly
                            />
                        </Field>
                        <Field id="prodi" label="Program studi">
                            <Input
                                id="prodi"
                                value={dosen.prodi ?? "-"}
                                disabled
                                readOnly
                            />
                        </Field>

                        <Field
                            id="sintaid"
                            label="SINTA ID"
                            required
                            error={errors.sintaid}
                        >
                            <Input
                                id="sintaid"
                                value={data.sintaid}
                                onChange={(e) =>
                                    setData("sintaid", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            id="nidn"
                            label="NIDN"
                            required
                            error={errors.nidn}
                        >
                            <Input
                                id="nidn"
                                value={data.nidn}
                                onChange={(e) =>
                                    setData("nidn", e.target.value)
                                }
                            />
                        </Field>
                        <Field id="nuptk" label="NUPTK" error={errors.nuptk}>
                            <Input
                                id="nuptk"
                                value={data.nuptk}
                                onChange={(e) =>
                                    setData("nuptk", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            id="pendidikan_terakhir"
                            label="Pendidikan terakhir"
                            required
                            error={errors.pendidikan_terakhir}
                        >
                            <Input
                                id="pendidikan_terakhir"
                                value={data.pendidikan_terakhir}
                                onChange={(e) =>
                                    setData(
                                        "pendidikan_terakhir",
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field
                            id="jabatan_fungsional"
                            label="Jabatan fungsional"
                            required
                            error={errors.jabatan_fungsional}
                        >
                            <Input
                                id="jabatan_fungsional"
                                value={data.jabatan_fungsional}
                                onChange={(e) =>
                                    setData(
                                        "jabatan_fungsional",
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                    </CardContent>
                </Card>

                {/* Data pribadi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data pribadi</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Field
                            id="gelar_depan"
                            label="Gelar depan"
                            error={errors.gelar_depan}
                        >
                            <Input
                                id="gelar_depan"
                                placeholder="Contoh: Dr."
                                value={data.gelar_depan}
                                onChange={(e) =>
                                    setData("gelar_depan", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            id="gelar_belakang"
                            label="Gelar belakang"
                            error={errors.gelar_belakang}
                        >
                            <Input
                                id="gelar_belakang"
                                placeholder="Contoh: M.Kom."
                                value={data.gelar_belakang}
                                onChange={(e) =>
                                    setData("gelar_belakang", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            id="nama_dosen"
                            label="Nama dosen"
                            required
                            error={errors.nama_dosen}
                            className="sm:col-span-2"
                        >
                            <Input
                                id="nama_dosen"
                                value={data.nama_dosen}
                                onChange={(e) =>
                                    setData("nama_dosen", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            id="jenis_kelamin"
                            label="Jenis kelamin"
                            error={errors.jenis_kelamin}
                        >
                            <Select
                                value={data.jenis_kelamin || undefined}
                                onValueChange={(v) =>
                                    setData("jenis_kelamin", v)
                                }
                            >
                                <SelectTrigger
                                    id="jenis_kelamin"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Laki-laki</SelectItem>
                                    <SelectItem value="P">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            id="tanggal_lahir"
                            label="Tanggal lahir"
                            error={errors.tanggal_lahir}
                        >
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                value={data.tanggal_lahir}
                                onChange={(e) =>
                                    setData("tanggal_lahir", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            id="tempat_lahir"
                            label="Tempat lahir"
                            error={errors.tempat_lahir}
                        >
                            <Input
                                id="tempat_lahir"
                                value={data.tempat_lahir}
                                onChange={(e) =>
                                    setData("tempat_lahir", e.target.value)
                                }
                            />
                        </Field>
                        <Field id="hp" label="No. HP" error={errors.hp}>
                            <Input
                                id="hp"
                                type="tel"
                                value={data.hp}
                                onChange={(e) => setData("hp", e.target.value)}
                            />
                        </Field>
                        <Field
                            id="email"
                            label="Email"
                            required
                            error={errors.email}
                            className="sm:col-span-2"
                        >
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            id="alamat"
                            label="Alamat"
                            error={errors.alamat}
                            className="sm:col-span-2"
                        >
                            <Textarea
                                id="alamat"
                                rows={3}
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                            />
                        </Field>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Save />
                        )}
                        Simpan perubahan
                    </Button>
                </div>
            </form>
        </>
    );
}

EditProfile.layout = {
    breadcrumbs: [
        {
            title: "Profil",
        },
    ],
};
