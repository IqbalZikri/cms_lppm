import axios from "axios";
import { useEffect } from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    BookText,
    FileText,
    Link2,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Fakultas } from "@/interface/fakultas";
import { Dosen } from "@/types/dosen";
import { Form, Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Field, FieldGroup } from "@/components/ui/field";
import { Combobox } from "@/components/ui/combobox";
import { Penulis } from "@/interface/penulis";
import { LuaranBuku } from "@/interface/luaran-buku";
import { PenulisLuar } from "@/interface/penulis-luar";

interface Props {
    fakultas: Fakultas[];
    luaranBuku?: LuaranBuku;
    role?: string;
}

type TipePenulis = "internal" | "luar";

interface AuthorRow {
    key: string;
    tipe: TipePenulis;
    // internal
    fakultasId: string;
    dosenId: string;
    dosenOptions: Dosen[];
    loadingDosen: boolean;
    // luar
    nama_universitas: string;
    nama_dosen: string;
}

function makeKey() {
    return Math.random().toString(36).slice(2);
}

function emptyRow(tipe: TipePenulis): AuthorRow {
    return {
        key: makeKey(),
        tipe,
        fakultasId: "",
        dosenId: "",
        dosenOptions: [],
        loadingDosen: false,
        nama_universitas: "",
        nama_dosen: "",
    };
}

// Gabungkan penulis internal dan luar, lalu urutkan berdasarkan `urutan`
function buildInitialAuthors(
    penulis: Penulis[] | undefined,
    penulisLuar: PenulisLuar[] | undefined,
): AuthorRow[] {
    const internal = (penulis ?? []).map((p) => ({
        urutan: p.urutan,
        row: {
            ...emptyRow("internal"),
            fakultasId: String(p.fakultas_id),
            dosenId: String(p.dosen_id),
        },
    }));

    const luar = (penulisLuar ?? []).map((p) => ({
        urutan: p.urutan,
        row: {
            ...emptyRow("luar"),
            nama_universitas: p.nama_universitas,
            nama_dosen: p.nama_dosen,
        },
    }));

    const merged = [...internal, ...luar]
        .sort((a, b) => a.urutan - b.urutan)
        .map((x) => x.row);

    // Form baru: mulai dengan satu penulis internal kosong
    return merged.length > 0 ? merged : [emptyRow("internal")];
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

/** Small section heading used to break the long form into readable groups. */
function SectionHeading({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <h3 className="text-base font-semibold leading-none">
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function FormLuaranBuku({ fakultas, luaranBuku, role }: Props) {
    const isEdit = !!luaranBuku;

    console.log(luaranBuku);
    
    const actionAdmin = isEdit
        ? route("admin.luaran_buku.update", luaranBuku!.id)
        : route("admin.luaran_buku.store");

    const actionDosen = isEdit
        ? route("dosen.luaran_buku.update", luaranBuku!.id)
        : route("dosen.luaran_buku.store");

    const actionUppm = isEdit
        ? route("uppm.luaran_buku.update", luaranBuku!.id)
        : route("uppm.luaran_buku.store");

    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(luaranBuku?.penulis, luaranBuku?.penulis_luar),
    );

    function addAuthor(tipe: TipePenulis) {
        setAuthors((prev) => [...prev, emptyRow(tipe)]);
    }

    function removeAuthor(key: string) {
        setAuthors((prev) => prev.filter((a) => a.key !== key));
    }

    function moveAuthor(index: number, dir: -1 | 1) {
        setAuthors((prev) => {
            const target = index + dir;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    function updateAuthorLuar(
        key: string,
        field: "nama_universitas" | "nama_dosen",
        value: string,
    ) {
        setAuthors((prev) =>
            prev.map((a) => (a.key === key ? { ...a, [field]: value } : a)),
        );
    }

    async function fetchDosenByFakultas(fakultasId: string): Promise<Dosen[]> {
        const { data } = await axios.get<Dosen[]>(
            route("dosen.getDosen", fakultasId),
        );
        return data;
    }

    // Kalau mode edit dan baris sudah punya fakultasId dari awal,
    // langsung fetch daftar dosennya begitu komponen mount.
    useEffect(() => {
        authors.forEach((author) => {
            if (
                author.tipe === "internal" &&
                author.fakultasId &&
                author.dosenOptions.length === 0
            ) {
                handleFakultasChange(author.key, author.fakultasId, false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleFakultasChange(
        key: string,
        fakultasId: string,
        resetDosen = true,
    ) {
        setAuthors((prev) =>
            prev.map((a) =>
                a.key === key
                    ? {
                          ...a,
                          fakultasId,
                          dosenId: resetDosen ? "" : a.dosenId,
                          loadingDosen: true,
                      }
                    : a,
            ),
        );

        try {
            const options = await fetchDosenByFakultas(fakultasId);
            setAuthors((prev) =>
                prev.map((a) =>
                    a.key === key
                        ? { ...a, dosenOptions: options, loadingDosen: false }
                        : a,
                ),
            );
        } catch (error) {
            setAuthors((prev) =>
                prev.map((a) =>
                    a.key === key
                        ? { ...a, dosenOptions: [], loadingDosen: false }
                        : a,
                ),
            );
        }
    }

    function updateAuthorDosen(key: string, dosenId: string) {
        setAuthors((prev) =>
            prev.map((a) => (a.key === key ? { ...a, dosenId } : a)),
        );
    }

    return (
        <Form
            action={
                role === "dosen"
                    ? actionDosen
                    : role === "uppm"
                      ? actionUppm
                      : actionAdmin
            }
            method={isEdit ? "put" : "post"}
        >
            {({ errors, processing }) => (
                <Card className="w-full shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 lg:gap-10">
                        {/* Kolom kiri: Informasi Publikasi + Detail Buku */}
                        <div className="space-y-8 lg:col-span-2">
                            <div className="space-y-5">
                                <SectionHeading
                                    icon={BookText}
                                    title="Informasi Publikasi"
                                    description="Judul dan ringkasan singkat dari Luaran Buku."
                                />

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="judul"
                                                className="text-base"
                                            >
                                                Judul
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="judul"
                                                name="judul"
                                                defaultValue={luaranBuku?.judul}
                                                placeholder="Contoh: Analisis Implementasi..."
                                                className="h-11 text-base"
                                                aria-invalid={!!errors.judul}
                                            />
                                            {errors.judul && (
                                                <p className="text-sm text-red-500">
                                                    {errors.judul}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="isbn"
                                                className="text-base"
                                            >
                                                ISBN
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="isbn"
                                                name="isbn"
                                                defaultValue={luaranBuku?.isbn}
                                                placeholder="ISBN"
                                                className="h-11 text-base"
                                                aria-invalid={!!errors.isbn}
                                            />
                                            {errors.isbn && (
                                                <p className="text-sm text-red-500">
                                                    {errors.isbn}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={FileText}
                                    title="Detail Buku"
                                    description="Waktu terbit dan berkas pendukung."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="tahun"
                                            className="text-base"
                                        >
                                            Tahun
                                            <RequiredMark />
                                        </Label>
                                        <Input
                                            id="tahun"
                                            name="tahun"
                                            type="number"
                                            defaultValue={luaranBuku?.tahun}
                                            placeholder="2026"
                                            className="h-11 text-base"
                                        />
                                        {errors.tahun && (
                                            <p className="text-sm text-red-500">
                                                {errors.tahun}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <Label
                                        htmlFor="link_berkas"
                                        className="text-base"
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            <Link2 className="h-3.5 w-3.5" />
                                            Link Berkas
                                        </span>
                                        <RequiredMark />
                                    </Label>
                                    <Input
                                        id="link_berkas"
                                        name="link_berkas"
                                        type="url"
                                        defaultValue={luaranBuku?.link_berkas}
                                        placeholder="https://drive.google.com/..."
                                        className="h-11 text-base"
                                    />
                                    {errors.link_berkas && (
                                        <p className="text-sm text-red-500">
                                            {errors.link_berkas}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kolom kanan: Penulis — panel terpisah agar ruang lebar dashboard tidak kosong */}
                        <div className="space-y-5 rounded-xl border bg-muted/20 p-5 lg:col-span-1 lg:self-start">
                            <SectionHeading
                                icon={Users}
                                title="Penulis"
                                description="Urutan di sini adalah urutan penulis pada buku. Gunakan panah untuk menggeser."
                            />

                            {authors.length === 0 && (
                                <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    Belum ada penulis. Klik tombol di bawah
                                    untuk menambahkan.
                                </p>
                            )}

                            <div className="space-y-4">
                                {authors.map((author, index) => (
                                    <div
                                        key={author.key}
                                        className="relative rounded-lg border bg-muted/30 p-4"
                                    >
                                        {/* Header kartu */}
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                                    {index + 1}
                                                </span>
                                                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                                    {author.tipe === "internal"
                                                        ? "Dosen Internal"
                                                        : "Luar Universitas"}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={index === 0}
                                                    onClick={() =>
                                                        moveAuthor(index, -1)
                                                    }
                                                    aria-label={`Naikkan penulis ${index + 1}`}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={
                                                        index ===
                                                        authors.length - 1
                                                    }
                                                    onClick={() =>
                                                        moveAuthor(index, 1)
                                                    }
                                                    aria-label={`Turunkan penulis ${index + 1}`}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() =>
                                                        removeAuthor(author.key)
                                                    }
                                                    aria-label={`Hapus penulis ${index + 1}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Isi kartu sesuai tipe */}
                                        {author.tipe === "internal" ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Fakultas
                                                        </Label>
                                                        <Combobox
                                                            options={fakultas.map(
                                                                (f) => ({
                                                                    value: String(
                                                                        f.id,
                                                                    ),
                                                                    label: f.nama_fakultas,
                                                                }),
                                                            )}
                                                            value={
                                                                author.fakultasId
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleFakultasChange(
                                                                    author.key,
                                                                    value,
                                                                )
                                                            }
                                                            placeholder="Pilih fakultas"
                                                            searchPlaceholder="Cari fakultas..."
                                                        />
                                                        {errors[
                                                            `authors.${index}.fakultas_id`
                                                        ] && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                        `authors.${index}.fakultas_id`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </Field>
                                                </FieldGroup>

                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Nama Dosen
                                                        </Label>
                                                        <Combobox
                                                            options={author.dosenOptions.map(
                                                                (d) => ({
                                                                    value: String(
                                                                        d.id,
                                                                    ),
                                                                    label: d.nama_dosen,
                                                                }),
                                                            )}
                                                            value={
                                                                author.dosenId
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                updateAuthorDosen(
                                                                    author.key,
                                                                    value,
                                                                )
                                                            }
                                                            placeholder={
                                                                !author.fakultasId
                                                                    ? "Pilih fakultas dulu"
                                                                    : author.loadingDosen
                                                                      ? "Memuat dosen..."
                                                                      : author
                                                                              .dosenOptions
                                                                              .length ===
                                                                          0
                                                                        ? "Tidak ada data dosen"
                                                                        : "Pilih dosen"
                                                            }
                                                            searchPlaceholder="Cari dosen..."
                                                            disabled={
                                                                !author.fakultasId ||
                                                                author.loadingDosen ||
                                                                author
                                                                    .dosenOptions
                                                                    .length ===
                                                                    0
                                                            }
                                                        />
                                                        {errors[
                                                            `authors.${index}.dosen_id`
                                                        ] && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                        `authors.${index}.dosen_id`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </Field>
                                                </FieldGroup>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3">
                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Universitas
                                                        </Label>
                                                        <Input
                                                            value={
                                                                author.nama_universitas
                                                            }
                                                            onChange={(e) =>
                                                                updateAuthorLuar(
                                                                    author.key,
                                                                    "nama_universitas",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Nama Universitas"
                                                        />
                                                        {errors[
                                                            `authors.${index}.nama_universitas`
                                                        ] && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                        `authors.${index}.nama_universitas`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </Field>
                                                </FieldGroup>

                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Nama Dosen
                                                        </Label>
                                                        <Input
                                                            value={
                                                                author.nama_dosen
                                                            }
                                                            onChange={(e) =>
                                                                updateAuthorLuar(
                                                                    author.key,
                                                                    "nama_dosen",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Nama Dosen"
                                                        />
                                                        {errors[
                                                            `authors.${index}.nama_dosen`
                                                        ] && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                        `authors.${index}.nama_dosen`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </Field>
                                                </FieldGroup>
                                            </div>
                                        )}

                                        {/* Hidden input: semua pakai index dari posisi array */}
                                        <input
                                            type="hidden"
                                            name={`authors[${index}][tipe]`}
                                            value={author.tipe}
                                        />
                                        {author.tipe === "internal" ? (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name={`authors[${index}][fakultas_id]`}
                                                    value={author.fakultasId}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`authors[${index}][dosen_id]`}
                                                    value={author.dosenId}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name={`authors[${index}][nama_universitas]`}
                                                    value={
                                                        author.nama_universitas
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`authors[${index}][nama_dosen]`}
                                                    value={author.nama_dosen}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Dua tombol tambah */}
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addAuthor("internal")}
                                    className="h-10 w-full text-sm"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Tambah Dosen Internal
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addAuthor("luar")}
                                    className="h-10 w-full text-sm"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Tambah Penulis Luar Universitas
                                </Button>
                            </div>

                            {errors.authors && (
                                <p className="text-sm text-red-500">
                                    {errors.authors}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={
                                role === "dosen"
                                    ? route("dosen.luaran_buku.index")
                                    : role === "uppm"
                                      ? route("uppm.luaran_buku.index")
                                      : route("admin.luaran_buku.index")
                            }
                            viewTransition
                            className="w-full sm:w-auto"
                        >
                            <Button
                                className="h-11 w-full px-6 text-base sm:w-auto"
                                variant="outline"
                            >
                                <ArrowLeft />
                                Kembali
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 w-full px-6 text-base sm:w-auto"
                        >
                            {isEdit ? "Simpan Perubahan" : "Simpan Luaran Buku"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
