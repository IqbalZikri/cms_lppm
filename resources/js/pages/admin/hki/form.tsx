import axios from "axios";
import { useEffect } from "react";
import {
    ArrowLeft,
    BookText,
    FileText,
    Hash,
    Link2,
    Plus,
    Trash2,
    Users,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas } from "@/interface/fakultas";
import { Dosen } from "@/types/dosen";
import { Form, Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Hki } from "@/interface/hki";
import { Penulis } from "@/interface/penulis";
import { Field, FieldGroup } from "@/components/ui/field";

interface Props {
    fakultas: Fakultas[];
    hki?: Hki;
}

interface AuthorRow {
    key: string;
    fakultasId: string;
    dosenId: string;
    fakultasOptions: Fakultas[];
    dosenOptions: Dosen[];
    loadingDosen: boolean;
}

function makeKey() {
    return Math.random().toString(36).slice(2);
}

function buildInitialAuthors(penulis: Penulis[] | undefined): AuthorRow[] {
    if (!penulis || penulis.length === 0) {
        return [
            {
                key: makeKey(),
                fakultasId: "",
                dosenId: "",
                fakultasOptions: [],
                dosenOptions: [],
                loadingDosen: false,
            },
        ];
    }

    return penulis.map((p) => ({
        key: makeKey(),
        fakultasId: String(p.fakultas_id),
        dosenId: String(p.dosen_id),
        fakultasOptions: [],
        dosenOptions: [],
        loadingDosen: false,
    }));
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

export default function FormHki({ fakultas, hki }: Props) {
    const isEdit = !!hki;
    const [jenisHki, setJenisHki] = useState(hki?.jenis_hki ?? "");
    const [semester, setSemester] = useState(hki?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(hki?.sumber_dana ?? "");

    const action = isEdit
        ? route("admin.hki.update", hki!.id)
        : route("admin.hki.store");

    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(hki?.penulis),
    );

    async function fetchDosenByFakultas(fakultasId: string): Promise<Dosen[]> {
        const { data } = await axios.get<Dosen[]>(
            route("admin.dosen.getDosen", fakultasId),
        );
        return data;
    }

    // Kalau mode edit dan baris sudah punya fakultasId dari awal,
    // langsung fetch daftar dosennya begitu komponen mount.
    useEffect(() => {
        authors.forEach((author) => {
            if (author.fakultasId && author.dosenOptions.length === 0) {
                handleFakultasChange(author.key, author.fakultasId, false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function addAuthor() {
        setAuthors((prev) => [
            ...prev,
            {
                key: makeKey(),
                fakultasId: "",
                dosenId: "",
                fakultasOptions: [],
                dosenOptions: [],
                loadingDosen: false,
            },
        ]);
    }

    function removeAuthor(key: string) {
        setAuthors((prev) => prev.filter((a) => a.key !== key));
    }

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
        <Form action={action} method={isEdit ? "put" : "post"}>
            {({ errors, processing }) => (
                <Card className="w-full shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 lg:gap-10">
                        {/* Kolom kiri: Informasi Publikasi + Detail HKI */}
                        <div className="space-y-8 lg:col-span-2">
                            <div className="space-y-5">
                                <SectionHeading
                                    icon={BookText}
                                    title="Informasi Publikasi"
                                    description="Judul dan ringkasan singkat dari hak kekayaan intelektual."
                                />

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="jenis_hki"
                                                className="text-base"
                                            >
                                                Jenis HKI
                                                <RequiredMark />
                                            </Label>
                                            <Select
                                                name="jenis_hki"
                                                value={jenisHki}
                                                onValueChange={setJenisHki}
                                            >
                                                <SelectTrigger
                                                    id="jenis_hki"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.jenis_hki
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih jenis HKI" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="paten">
                                                        Paten
                                                    </SelectItem>
                                                    <SelectItem value="haki">
                                                        HAKI
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_hki && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jenis_hki}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>

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
                                                defaultValue={hki?.judul}
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
                                                htmlFor="abstrak"
                                                className="text-base"
                                            >
                                                Abstrak
                                                <RequiredMark />
                                            </Label>
                                            <Textarea
                                                id="abstrak"
                                                name="abstrak"
                                                defaultValue={hki?.abstrak}
                                                placeholder="Ringkasan singkat hak kekayaan intelektual"
                                                rows={6}
                                                className="text-base"
                                                aria-invalid={!!errors.abstrak}
                                            />
                                            {errors.abstrak && (
                                                <p className="text-sm text-red-500">
                                                    {errors.abstrak}
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
                                    title="Detail HKI"
                                    description="Waktu terbit dan berkas pendukung."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="semester"
                                                    className="text-base"
                                                >
                                                    Semester
                                                    <RequiredMark />
                                                </Label>
                                                <Select
                                                    value={semester}
                                                    onValueChange={setSemester}
                                                >
                                                    <SelectTrigger
                                                        id="semester"
                                                        className="h-11 text-base"
                                                        aria-invalid={
                                                            !!errors.semester
                                                        }
                                                    >
                                                        <SelectValue placeholder="Pilih semester" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Ganjil">
                                                            Ganjil
                                                        </SelectItem>
                                                        <SelectItem value="Genap">
                                                            Genap
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="hidden"
                                                    name="semester"
                                                    value={semester}
                                                />
                                                {errors.semester && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.semester}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
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
                                                    defaultValue={hki?.tahun}
                                                    placeholder="2026"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.tahun
                                                    }
                                                />
                                                {errors.tahun && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.tahun}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
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
                                                defaultValue={hki?.link_berkas}
                                                placeholder="https://drive.google.com/..."
                                                className="h-11 text-base"
                                                aria-invalid={
                                                    !!errors.link_berkas
                                                }
                                            />
                                            {errors.link_berkas && (
                                                <p className="text-sm text-red-500">
                                                    {errors.link_berkas}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={Wallet}
                                    title="Dana"
                                    description="Jumlah dan sumber dana."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="jumlah_dana"
                                                    className="text-base"
                                                >
                                                    Jumlah Dana
                                                    <RequiredMark />
                                                </Label>
                                                <Input
                                                    name="jumlah_dana"
                                                    id="jumlah_dana"
                                                    placeholder="Jumlah Dana"
                                                    value={hki?.jumlah_dana}
                                                    aria-invalid={
                                                        !!errors.jumlah_dana
                                                    }
                                                />
                                                {errors.jumlah_dana && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.jumlah_dana}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="sumber_dana"
                                                    className="text-base"
                                                >
                                                    Sumber Dana
                                                    <RequiredMark />
                                                </Label>
                                                <Select
                                                    name="sumber_dana"
                                                    value={sumberDana}
                                                    onValueChange={
                                                        setSumberDana
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="sumber_dana"
                                                        className="h-11 text-base"
                                                        aria-invalid={
                                                            !!errors.sumber_dana
                                                        }
                                                    >
                                                        <SelectValue placeholder="Pilih Sumber Dana" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="internal">
                                                            Internal
                                                        </SelectItem>
                                                        <SelectItem value="eksternal">
                                                            Eksternal
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.sumber_dana && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.sumber_dana}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={Hash}
                                    title="Nomor Pengajuan HAKI atau Nomor Paten"
                                    description="Nomor resmi pengajuan HAKI atau paten."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="sumber_dana"
                                                    className="text-base"
                                                >
                                                    Nomor Paten
                                                    {jenisHki === "paten" ? (
                                                        <RequiredMark />
                                                    ) : (
                                                        ""
                                                    )}
                                                </Label>
                                                <Input
                                                    name="nomer_paten"
                                                    id="nomer_paten"
                                                    placeholder="Nomor Paten"
                                                    disabled={
                                                        jenisHki === "haki" ||
                                                        !jenisHki
                                                    }
                                                    aria-invalid={
                                                        !!errors.nomer_paten
                                                    }
                                                    value={hki?.nomer_paten}
                                                />
                                                {errors.nomer_paten && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.nomer_paten}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="nomer_pengajuan_haki"
                                                    className="text-base"
                                                >
                                                    Nomor Pengajuan HAKI
                                                    {jenisHki === "haki" ? (
                                                        <RequiredMark />
                                                    ) : (
                                                        ""
                                                    )}
                                                </Label>
                                                <Input
                                                    name="nomer_pengajuan_haki"
                                                    id="nomer_pengajuan_haki"
                                                    placeholder="Nomor Pengajuan HAKI"
                                                    disabled={
                                                        jenisHki === "paten" ||
                                                        !jenisHki
                                                    }
                                                    aria-invalid={
                                                        !!errors.nomer_pengajuan_haki
                                                    }
                                                    value={hki?.nomer_pengajuan_haki}
                                                />
                                                {errors.nomer_pengajuan_haki && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.nomer_pengajuan_haki
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom kanan: Penulis — panel terpisah agar ruang lebar dashboard tidak kosong */}
                        <div className="space-y-5 rounded-xl border bg-muted/20 p-5 lg:col-span-1 lg:self-start">
                            <SectionHeading
                                icon={Users}
                                title="Penulis"
                                description="Tambahkan satu atau lebih dosen sebagai penulis."
                            />

                            <div className="space-y-4">
                                {authors.map((author, index) => (
                                    <div
                                        key={author.key}
                                        className="relative rounded-lg border bg-muted/30 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                                {index + 1}
                                            </span>
                                            {authors.length > 1 && (
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
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Fakultas
                                                        </Label>
                                                        <Select
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
                                                        >
                                                            <SelectTrigger className="h-11 bg-background text-base">
                                                                <SelectValue placeholder="Pilih fakultas" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {fakultas.map(
                                                                    (f) => (
                                                                        <SelectItem
                                                                            key={
                                                                                f.id
                                                                            }
                                                                            value={String(
                                                                                f.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                f.nama_fakultas
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
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
                                                        </Select>
                                                    </Field>
                                                </FieldGroup>
                                            </div>

                                            <div className="space-y-2">
                                                <FieldGroup>
                                                    <Field>
                                                        <Label className="text-sm text-muted-foreground">
                                                            Nama Dosen
                                                        </Label>
                                                        <Select
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
                                                            disabled={
                                                                !author.fakultasId ||
                                                                author.loadingDosen ||
                                                                (author
                                                                    .dosenOptions
                                                                    .length ===
                                                                    0 &&
                                                                    !author.loadingDosen &&
                                                                    !!author.fakultasId)
                                                            }
                                                        >
                                                            <SelectTrigger className="h-11 bg-background text-base">
                                                                <SelectValue
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
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {author.dosenOptions.map(
                                                                    (d) => (
                                                                        <SelectItem
                                                                            key={
                                                                                d.id
                                                                            }
                                                                            value={String(
                                                                                d.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                d.nama_dosen
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
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
                                                        </Select>
                                                    </Field>
                                                </FieldGroup>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {authors.map((author, index) => (
                                <div key={`hidden-${author.key}`}>
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
                                    <input
                                        type="hidden"
                                        name={`authors[${index}][nama_fakultas]`}
                                        value={
                                            fakultas.find(
                                                (f) =>
                                                    String(f.id) ===
                                                    author.fakultasId,
                                            )?.nama_fakultas ?? ""
                                        }
                                    />
                                    <input
                                        type="hidden"
                                        name={`authors[${index}][nama_dosen]`}
                                        value={
                                            author.dosenOptions.find(
                                                (d) =>
                                                    String(d.id) ===
                                                    author.dosenId,
                                            )?.nama_dosen ?? ""
                                        }
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addAuthor}
                                className="h-10 w-full text-sm"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Tambah Penulis
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={route("admin.hki.index")}
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
                            {isEdit ? "Simpan Perubahan" : "Simpan HKI"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
