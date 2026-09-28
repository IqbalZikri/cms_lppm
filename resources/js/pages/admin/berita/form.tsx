// resources/js/Pages/Admin/Berita/Partials/BeritaForm.tsx
import { FormEventHandler, useState } from "react";
import { Form, Link, useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Loader2, X } from "lucide-react";
import { route } from "ziggy-js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/rich-text-editor";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Berita } from "@/interface/berita";

interface Kategori {
    id: number;
    nama_kategori: string;
}

interface Props {
    kategoris: Kategori[];
    berita?: Berita; // ada isinya = mode edit, undefined = mode create
}

export function generateSlug(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function BeritaForm({ kategoris, berita }: Props) {
    const isEdit = !!berita;

    const [preview, setPreview] = useState<string | null>(
        berita?.gambar ?? null,
    );
    const [slugManual, setSlugManual] = useState(isEdit); // di edit, slug sudah ada -> anggap manual

    const { data, setData, post, put, processing, errors, reset } = useForm({
        kategori_id: berita ? String(berita.kategori_id) : "",
        judul_berita: berita?.judul_berita ?? "",
        slug: berita?.slug ?? "",
        ringkasan_berita: berita?.ringkasan_berita ?? "",
        isi_berita: berita?.isi_berita ?? "",
        status_published: berita?.status_published ?? "",
        published_at: berita?.published_at ?? "",
        gambar: null as File | null,
    });

    const handleJudulChange = (value: string) => {
        setData((prevData) => ({
            ...prevData,
            judul_berita: value,
            slug: generateSlug(value),
        }));
    };

    const handleGambarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("gambar", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(berita?.gambar ?? null);
        }
    };

    const removeGambar = () => {
        setData("gambar", null);
        setPreview(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            // POST + _method: put -> supaya file upload tetap jalan (Laravel/PHP
            // tidak bisa parse multipart/form-data pada request PUT asli)
            put(route("admin.berita.update", berita!.id), {
                forceFormData: true,
                onSuccess: () => setData("gambar", null),
                // Inertia otomatis menambahkan _method=PUT kalau method aslinya
                // di-set lewat useForm({ _method: 'put', ... }) — lihat catatan di bawah.
            });
        } else {
            post(route("admin.berita.store"), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Berita" : "Buat Berita Baru"}
                </CardTitle>
                <CardDescription>
                    {isEdit
                        ? "Perbarui detail berita di bawah ini."
                        : "Isi detail berita di bawah ini."}{" "}
                    Field yang bertanda{" "}
                    <span className="text-destructive">*</span> wajib diisi.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    {/* Kategori */}
                    <div className="space-y-2">
                        <Label htmlFor="kategori_id">
                            Kategori <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.kategori_id}
                            onValueChange={(value) =>
                                setData("kategori_id", value)
                            }
                        >
                            {kategoris.length === 0 ? (
                                <SelectTrigger id="kategori_id" disabled>
                                    <SelectValue placeholder="Data kategori belum ada" />
                                </SelectTrigger>
                            ) : (
                                <SelectTrigger id="kategori_id">
                                    <SelectValue
                                        placeholder="Pilih kategori berita"
                                        aria-invalid={!!errors.kategori_id}
                                    />
                                </SelectTrigger>
                            )}
                            <SelectContent>
                                {kategoris.map((kategori) => (
                                    <SelectItem
                                        key={kategori.id}
                                        value={String(kategori.id)}
                                    >
                                        {kategori.nama_kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button type="button" className="text-sm">
                                    Klik link ini untuk menambahkan{" "}
                                    <span className="underline">kategori</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent
                                onSubmit={(e) => e.stopPropagation()}
                            >
                                <DialogHeader>
                                    <DialogTitle>Tambah Kategori</DialogTitle>
                                </DialogHeader>
                                <Form
                                    action={route("admin.kategori.store")}
                                    method="POST"
                                    onSuccess={() => {
                                        setOpen(false);
                                    }}
                                    resetOnSuccess
                                >
                                    {({
                                        errors: kategoriErrors,
                                        processing: kategoriProcessing,
                                    }) => (
                                        <>
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="nama_kategori">
                                                        Nama Kategori
                                                    </FieldLabel>
                                                    <Input
                                                        name="nama_kategori"
                                                        placeholder="Nama Kategori"
                                                    />
                                                    {kategoriErrors.nama_kategori && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                kategoriErrors.nama_kategori
                                                            }
                                                        </p>
                                                    )}
                                                </Field>
                                            </FieldGroup>
                                            <DialogFooter className="mt-[20px]">
                                                <DialogClose asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        Kembali
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        kategoriProcessing
                                                    }
                                                >
                                                    {kategoriProcessing
                                                        ? "...Menyimpan"
                                                        : "Simpan"}
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                        {/* <small>
                            Pastikan data kategori sudah ada di{" "}
                            <Link
                                href={route("admin.kategori.index")}
                                className="underline"
                                viewTransition
                            >
                                Kategori
                            </Link>
                        </small> */}
                        {errors.kategori_id && (
                            <p className="text-destructive text-sm">
                                {errors.kategori_id}
                            </p>
                        )}
                    </div>

                    {/* Judul */}
                    <div className="space-y-2">
                        <Label htmlFor="judul_berita">
                            Judul Berita{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="judul_berita"
                            value={data.judul_berita}
                            onChange={(e) => handleJudulChange(e.target.value)}
                            placeholder="Masukkan judul berita"
                        />
                        {errors.judul_berita && (
                            <p className="text-destructive text-sm">
                                {errors.judul_berita}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => {
                                setSlugManual(true);
                                setData("slug", generateSlug(e.target.value));
                            }}
                            placeholder="judul-berita-otomatis"
                        />
                        {errors.slug && (
                            <p className="text-destructive text-sm">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Ringkasan */}
                    <div className="space-y-2">
                        <Label htmlFor="ringkasan_berita">
                            Ringkasan Berita{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="ringkasan_berita"
                            rows={3}
                            value={data.ringkasan_berita}
                            onChange={(e) =>
                                setData("ringkasan_berita", e.target.value)
                            }
                            placeholder="Ringkasan singkat yang tampil di daftar berita"
                        />
                        {errors.ringkasan_berita && (
                            <p className="text-destructive text-sm">
                                {errors.ringkasan_berita}
                            </p>
                        )}
                    </div>

                    {/* Isi Berita */}
                    <div className="space-y-2">
                        <Label htmlFor="isi_berita">
                            Isi Berita{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <RichTextEditor
                            value={data.isi_berita}
                            onChange={(value) => setData("isi_berita", value)}
                        />

                        {errors.isi_berita && (
                            <p className="text-destructive text-sm">
                                {errors.isi_berita}
                            </p>
                        )}
                    </div>

                    {/* Gambar */}
                    <div className="space-y-2">
                        <Label htmlFor="gambar">Gambar Berita</Label>

                        {preview ? (
                            <div className="relative w-full max-w-sm">
                                <img
                                    src={preview}
                                    alt="Preview gambar"
                                    className="h-48 w-full rounded-md border object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={removeGambar}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="gambar"
                                className="text-muted-foreground hover:bg-accent/50 flex h-40 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed"
                            >
                                <ImagePlus className="h-8 w-8" />
                                <span className="text-sm">
                                    Klik untuk unggah gambar
                                </span>
                            </label>
                        )}

                        <Input
                            id="gambar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleGambarChange}
                        />
                        {errors.gambar && (
                            <p className="text-destructive text-sm">
                                {errors.gambar}
                            </p>
                        )}
                    </div>

                    {/* Status Publish */}
                    <div className="flex flex-col rounded-md border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="status_published">
                                Publikasikan{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <p className="text-muted-foreground text-xs">
                                Aktifkan jika berita ingin langsung tampil ke
                                publik.
                            </p>
                        </div>
                        <RadioGroup
                            className="mt-[20px]"
                            value={data.status_published}
                            onValueChange={(value) =>
                                setData("status_published", value)
                            }
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="draft" id="draft" />
                                <Label htmlFor="draft">Draft</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="published"
                                    id="published"
                                />
                                <Label htmlFor="published">Published</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Tanggal Publish */}
                    {data.status_published == "published" && (
                        <div className="space-y-2">
                            <Label htmlFor="published_at">
                                Tanggal Publish
                            </Label>
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={data.published_at ?? ""}
                                onChange={(e) =>
                                    setData("published_at", e.target.value)
                                }
                            />
                            <p className="text-muted-foreground text-xs">
                                Kosongkan untuk menggunakan waktu saat ini.
                            </p>
                            {errors.published_at && (
                                <p className="text-destructive text-sm">
                                    {errors.published_at}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link
                                href={route("admin.berita.index")}
                                viewTransition
                            >
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? "Perbarui Berita" : "Simpan Berita"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
