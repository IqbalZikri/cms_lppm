import axios from "axios";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas } from "@/interface/fakultas";
import { Kegiatan } from "@/interface/kegiatan";
import { Dosen } from "@/types/dosen";
import { Form } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";

interface Props {
    fakultas: Fakultas[];
    dosen?: Dosen[];
    kegiatan?: Kegiatan; // kalau ada berarti mode edit
}

interface AuthorRow {
    key: string;
    fakultasId: string;
    dosenId: string;
    dosenOptions: Dosen[];
    loadingDosen: boolean;
}

function makeKey() {
    return Math.random().toString(36).slice(2);
}

function buildInitialAuthors(
    penulis: string | undefined,
    dosenList: Dosen[],
): AuthorRow[] {
    if (!penulis) {
        return [
            {
                key: makeKey(),
                fakultasId: "",
                dosenId: "",
                dosenOptions: [],
                loadingDosen: false,
            },
        ];
    }

    const names = penulis
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);

    if (names.length === 0) {
        return [
            {
                key: makeKey(),
                fakultasId: "",
                dosenId: "",
                dosenOptions: [],
                loadingDosen: false,
            },
        ];
    }

    return names.map((name) => {
        const match = dosenList.find(
            (d) => d.nama_dosen.toLowerCase() === name.toLowerCase(),
        );
        return {
            key: makeKey(),
            fakultasId: match ? String(match.fakultas_id) : "",
            dosenId: match ? String(match.id) : "",
            dosenOptions: [],
            loadingDosen: false,
        };
    });
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormKegiatan({
    fakultas,
    dosen = [],
    kegiatan,
}: Props) {
    const isEdit = !!kegiatan;
    
    const [dosenId, setDosenId] = useState(
        kegiatan?.dosen_id ? String(kegiatan.dosen_id) : "",
    );
    const [semester, setSemester] = useState(kegiatan?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(kegiatan?.sumber_dana ?? "");

    const action = isEdit
        ? route("admin.kegiatan.update", kegiatan!.id)
        : route("admin.kegiatan.store");

    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(
            kegiatan?.penulis ? String(kegiatan.penulis) : undefined,
            dosen,
        ),
    );

    async function fetchDosenByFakultas(fakultasId: string): Promise<Dosen[]> {
        const { data } = await axios.get<Dosen[]>(
            route("prodi.getDosen", fakultasId),
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

    // Untuk edit mode, nama dosen terpilih diambil dari dosenOptions baris itu sendiri
    const penulisValue = authors
        .map(
            (a) =>
                a.dosenOptions.find((d) => String(d.id) === a.dosenId)
                    ?.nama_dosen,
        )
        .filter(Boolean)
        .join(", ");

    return (
        <Form action={action} method={isEdit ? "put" : "post"}>
            {({ errors, processing }) => (
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
                        </CardTitle>
                        <CardDescription>
                            {isEdit
                                ? "Perbarui data kegiatan penelitian di bawah ini."
                                : "Isi data kegiatan penelitian dengan lengkap dan benar."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Dosen (opsional, misal untuk admin yang pilih atas nama dosen mana) */}
                        {dosen.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="dosen_id" className="text-base">
                                    Dosen
                                    <RequiredMark />
                                </Label>
                                <Select
                                    value={dosenId}
                                    onValueChange={setDosenId}
                                >
                                    <SelectTrigger
                                        id="dosen_id"
                                        className="h-11 text-base"
                                    >
                                        <SelectValue placeholder="Pilih dosen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dosen.map((d) => (
                                            <SelectItem
                                                key={d.id}
                                                value={String(d.id)}
                                            >
                                                {d.nama_dosen}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    name="dosen_id"
                                    value={dosenId}
                                />
                                {errors.dosen_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.dosen_id}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Judul Kegiatan */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="judul_kegiatan"
                                className="text-base"
                            >
                                Judul Kegiatan
                                <RequiredMark />
                            </Label>
                            <Input
                                id="judul_kegiatan"
                                name="judul_kegiatan"
                                defaultValue={kegiatan?.judul_kegiatan}
                                placeholder="Contoh: Analisis Implementasi..."
                                className="h-11 text-base"
                            />
                            {errors.judul_kegiatan && (
                                <p className="text-sm text-red-500">
                                    {errors.judul_kegiatan}
                                </p>
                            )}
                        </div>

                        {/* Abstrak */}
                        <div className="space-y-2">
                            <Label htmlFor="abstrak" className="text-base">
                                Abstrak
                                <RequiredMark />
                            </Label>
                            <Textarea
                                id="abstrak"
                                name="abstrak"
                                defaultValue={kegiatan?.abstrak}
                                placeholder="Ringkasan singkat kegiatan penelitian"
                                rows={5}
                                className="text-base"
                            />
                            {errors.abstrak && (
                                <p className="text-sm text-red-500">
                                    {errors.abstrak}
                                </p>
                            )}
                        </div>

                        {/* Semester & Tahun */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="semester" className="text-base">
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tahun" className="text-base">
                                    Tahun
                                    <RequiredMark />
                                </Label>
                                <Input
                                    id="tahun"
                                    name="tahun"
                                    type="number"
                                    defaultValue={kegiatan?.tahun}
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

                        {/* Sumber Dana & Dana */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="sumber_dana"
                                    className="text-base"
                                >
                                    Sumber Dana
                                    <RequiredMark />
                                </Label>
                                <Select
                                    value={sumberDana}
                                    onValueChange={setSumberDana}
                                >
                                    <SelectTrigger
                                        id="sumber_dana"
                                        className="h-11 text-base"
                                    >
                                        <SelectValue placeholder="Pilih sumber dana" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Internal">
                                            Internal
                                        </SelectItem>
                                        <SelectItem value="Eksternal">
                                            Eksternal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    name="sumber_dana"
                                    value={sumberDana}
                                />
                                {errors.sumber_dana && (
                                    <p className="text-sm text-red-500">
                                        {errors.sumber_dana}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dana" className="text-base">
                                    Jumlah Dana (Rp)
                                    <RequiredMark />
                                </Label>
                                <Input
                                    id="dana"
                                    name="dana"
                                    type="number"
                                    defaultValue={kegiatan?.jumlah_dana}
                                    placeholder="5000000"
                                    className="h-11 text-base"
                                />
                                {errors.dana && (
                                    <p className="text-sm text-red-500">
                                        {errors.dana}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Link Berkas */}
                        <div className="space-y-2">
                            <Label htmlFor="link_berkas" className="text-base">
                                Link Berkas
                                <RequiredMark />
                            </Label>
                            <Input
                                id="link_berkas"
                                name="link_berkas"
                                type="url"
                                defaultValue={kegiatan?.link_berkas}
                                placeholder="https://drive.google.com/..."
                                className="h-11 text-base"
                            />
                            {errors.link_berkas && (
                                <p className="text-sm text-red-500">
                                    {errors.link_berkas}
                                </p>
                            )}
                        </div>

                        {/* Penulis */}
                        <div className="space-y-3">
                            <Label className="text-base">
                                Penulis
                                <RequiredMark />
                            </Label>

                            <div className="space-y-4">
                                {authors.map((author, index) => (
                                    <div
                                        key={author.key}
                                        className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                                    >
                                        <div className="space-y-2">
                                            <Label className="text-sm text-muted-foreground">
                                                Fakultas Penulis {index + 1}
                                            </Label>
                                            <Select
                                                value={author.fakultasId}
                                                onValueChange={(value) =>
                                                    handleFakultasChange(
                                                        author.key,
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 text-base">
                                                    <SelectValue placeholder="Pilih fakultas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fakultas.map((f) => (
                                                        <SelectItem
                                                            key={f.id}
                                                            value={String(f.id)}
                                                        >
                                                            {f.nama_fakultas}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm text-muted-foreground">
                                                Nama Dosen
                                            </Label>
                                            <Select
                                                value={author.dosenId}
                                                onValueChange={(value) =>
                                                    updateAuthorDosen(
                                                        author.key,
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    !author.fakultasId ||
                                                    author.loadingDosen
                                                }
                                            >
                                                <SelectTrigger className="h-11 text-base">
                                                    <SelectValue
                                                        placeholder={
                                                            !author.fakultasId
                                                                ? "Pilih fakultas dulu"
                                                                : author.loadingDosen
                                                                  ? "Memuat dosen..."
                                                                  : "Pilih dosen"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {author.dosenOptions.map(
                                                        (d) => (
                                                            <SelectItem
                                                                key={d.id}
                                                                value={String(
                                                                    d.id,
                                                                )}
                                                            >
                                                                {d.nama_dosen}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {authors.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() =>
                                                    removeAuthor(author.key)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addAuthor}
                                className="h-10 text-sm"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Tambah Penulis
                            </Button>

                            <input
                                type="hidden"
                                name="penulis"
                                value={penulisValue}
                            />

                            {errors.penulis && (
                                <p className="text-sm text-red-500">
                                    {errors.penulis}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 px-6 text-base"
                        >
                            {isEdit ? "Simpan Perubahan" : "Simpan Kegiatan"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
