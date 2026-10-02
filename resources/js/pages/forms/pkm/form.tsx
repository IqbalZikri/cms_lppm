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
import { Penulis } from "@/interface/penulis";
import { Field, FieldGroup } from "@/components/ui/field";
import { Pkm } from "@/interface/pkm";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Combobox } from "@/components/ui/combobox";

interface Props {
    fakultas: Fakultas[];
    pkm?: Pkm;
    role?: string;
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

export function formatRupiah(inputAngka: number) {
    return new Intl.NumberFormat("id-ID").format(inputAngka);
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

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

export default function FormPkm({ fakultas, pkm, role }: Props) {
    const isEdit = !!pkm;
    const [jenisPkm, setJenisPkm] = useState(pkm?.jenis_pkm ?? "");
    const [semester, setSemester] = useState(pkm?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(pkm?.sumber_dana ?? "");
    const [jumlahDana, setJumlahDana] = useState(
        pkm?.jumlah_dana ? String(pkm?.jumlah_dana) : "",
    );

    const actionAdmin = isEdit
        ? route("admin.pkm.update", pkm!.id)
        : route("admin.pkm.store");

    const actionDosen = isEdit
        ? route("dosen.pkm.update", pkm!.id)
        : route("dosen.pkm.store");

    const actionUppm = isEdit
        ? route("uppm.pkm.update", pkm!.id)
        : route("uppm.pkm.store");

    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(pkm?.penulis),
    );

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
                        {/* Kolom kiri: Informasi Publikasi + Detail pkm */}
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
                                                htmlFor="jenis_pkm"
                                                className="text-base"
                                            >
                                                Jenis PKM
                                                <RequiredMark />
                                            </Label>
                                            <Select
                                                name="jenis_pkm"
                                                value={jenisPkm}
                                                onValueChange={setJenisPkm}
                                            >
                                                <SelectTrigger
                                                    id="jenis_pkm"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.jenis_pkm
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih jenis PKM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pelaksanaan">
                                                        Pelaksanaan
                                                    </SelectItem>
                                                    <SelectItem value="jurnal">
                                                        Jurnal
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_pkm && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jenis_pkm}
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
                                                Judul PKM
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="judul"
                                                name="judul"
                                                defaultValue={pkm?.judul}
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
                                                defaultValue={pkm?.abstrak}
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
                                    title="Detail pkm"
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
                                                    defaultValue={pkm?.tahun}
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
                                                defaultValue={pkm?.link_berkas}
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
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="jumlah_dana"
                                                        inputMode="numeric"
                                                        placeholder="Jumlah Dana"
                                                        value={
                                                            jumlahDana
                                                                ? formatRupiah(
                                                                      Number(
                                                                          jumlahDana,
                                                                      ),
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setJumlahDana(
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    "",
                                                                ),
                                                            )
                                                        }
                                                        aria-invalid={
                                                            !!errors.jumlah_dana
                                                        }
                                                    />
                                                    <InputGroupAddon>
                                                        Rp.
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {/* <Input /> */}
                                                <input
                                                    type="hidden"
                                                    name="jumlah_dana"
                                                    value={jumlahDana}
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
                                            </div>

                                            <div className="space-y-2">
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
                            href={
                                role === "dosen"
                                    ? route("dosen.pkm.index")
                                    : role === "uppm"
                                      ? route("uppm.pkm.index")
                                      : route("admin.pkm.index")
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
                            {isEdit ? "Simpan Perubahan" : "Simpan pkm"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
