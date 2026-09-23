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
import { Dosen } from "@/types/dosen";
import { Form } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Pelaksana, Pkm } from "@/interface/pkm";

interface Props {
    fakultas: Fakultas[];
    pkm?: Pkm; // kalau ada berarti mode edit
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

function buildInitialAuthors(pelaksana: Pelaksana[] | undefined): AuthorRow[] {
    if (!pelaksana || pelaksana.length === 0) {
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

    return pelaksana.map((p) => ({
        key: makeKey(),
        fakultasId: String(p.fakultas_id),
        dosenId: String(p.dosen_id),
        dosenOptions: [],
        loadingDosen: false,
    }));
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormPkm({ fakultas, pkm }: Props) {
    const isEdit = !!pkm;
    const [jenisPkm, setJenisPkm] = useState(pkm?.jenis_pkm ?? "");
    const [semester, setSemester] = useState(pkm?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(pkm?.sumber_dana ?? "");

    const action = isEdit
        ? route("admin.pkm.update", pkm!.id)
        : route("admin.pkm.store");

    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(pkm?.penulis),
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
    console.log(pkm);
    

    return (
        <Form action={action} method={isEdit ? "put" : "post"}>
            {({ errors, processing }) => (
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {isEdit ? "Edit PKM" : "Tambah PKM"}
                        </CardTitle>
                        <CardDescription>
                            {isEdit
                                ? "Perbarui data PKM di bawah ini."
                                : "Isi data PKM dengan lengkap dan benar."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Jenis Pkm */}
                        <div className="space-y-2">
                            <Label htmlFor="jenis_pkm" className="text-base">
                                Jenis PKM
                                <RequiredMark />
                            </Label>
                            <Select
                                value={jenisPkm}
                                onValueChange={setJenisPkm}
                            >
                                <SelectTrigger
                                    id="jenis_pkm"
                                    className="h-11 text-base"
                                >
                                    <SelectValue placeholder="Pilih Jenis PKM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pelaksanaan">
                                        Pelaksanaan
                                    </SelectItem>
                                    <SelectItem value="jurnal">Jurnal</SelectItem>
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                name="jenis_pkm"
                                value={jenisPkm}
                            />
                            {errors.jenis_pkm && (
                                <p className="text-sm text-red-500">
                                    {errors.jenis_pkm}
                                </p>
                            )}
                        </div>
                        
                        {/* Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="judul" className="text-base">
                                Judul PKM
                                <RequiredMark />
                            </Label>
                            <Input
                                id="judul"
                                name="judul"
                                defaultValue={pkm?.judul}
                                placeholder="Contoh: Analisis Implementasi..."
                                className="h-11 text-base"
                            />
                            {errors.judul && (
                                <p className="text-sm text-red-500">
                                    {errors.judul}
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
                                defaultValue={pkm?.abstrak}
                                placeholder="Ringkasan singkat PKM"
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
                                    defaultValue={pkm?.tahun}
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
                                        <SelectItem value="internal">
                                            Internal
                                        </SelectItem>
                                        <SelectItem value="eksternal">
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
                                    name="jumlah_dana"
                                    type="number"
                                    defaultValue={pkm?.jumlah_dana}
                                    placeholder="5000000"
                                    className="h-11 text-base"
                                />
                                {errors.jumlah_dana && (
                                    <p className="text-sm text-red-500">
                                        {errors.jumlah_dana}
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
                                defaultValue={pkm?.link_berkas}
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
                                                Fakultas Penulis / Pelaksana {index + 1}
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
                                                    author.loadingDosen ||
                                                    (author.dosenOptions
                                                        .length === 0 &&
                                                        !author.loadingDosen &&
                                                        !!author.fakultasId)
                                                }
                                            >
                                                <SelectTrigger className="h-11 text-base">
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
                                className="h-10 text-sm"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Tambah Penulis
                            </Button>

                            {errors.authors && (
                                <p className="text-sm text-red-500">
                                    {errors.authors}
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
                            {isEdit ? "Simpan Perubahan" : "Simpan PKM"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
