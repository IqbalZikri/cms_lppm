import { Penulis } from "@/interface/penulis";
import { PenulisLuar } from "@/interface/penulis-luar";
import SectionHeading from "./section-heading";
import { useEffect, useState } from "react";
import { Kegiatan } from "@/interface/kegiatan";
import { Pkm } from "@/interface/pkm";
import { HasPenulis } from "@/interface/has-penulis";
import { Fakultas } from "@/types/fakultas";
import { route } from "ziggy-js";
import axios from "axios";
import { Dosen } from "@/types/dosen";
import { ArrowDown, ArrowUp, Plus, Trash2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "recharts";
import { Combobox } from "./ui/combobox";
import { Input } from "./ui/input";

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

interface Props {
    data?: HasPenulis;
    fakultas: Fakultas[];
    errors?: Record<string, string>;
    description?: string;
}

export default function FormPenulis({
    data,
    fakultas,
    errors = {},
    description = "Urutan di sini adalah urutan penulis. Gunakan panah untuk menggeser.",
}: Props) {
    const [authors, setAuthors] = useState<AuthorRow[]>(() =>
        buildInitialAuthors(data?.penulis, data?.penulis_luar),
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

    function updateAuthorDosen(key: string, dosenId: string) {
        setAuthors((prev) =>
            prev.map((a) => (a.key === key ? { ...a, dosenId } : a)),
        );
    }
    return (
        <>
            <div className="space-y-5 rounded-xl border bg-muted/20 p-5 lg:col-span-1 lg:self-start">
                <SectionHeading
                    icon={Users}
                    title="Penulis"
                    description="Urutan di sini adalah urutan penulis pada buku. Gunakan panah untuk menggeser."
                />

                {authors.length === 0 && (
                    <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Belum ada penulis. Klik tombol di bawah untuk
                        menambahkan.
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
                                        onClick={() => moveAuthor(index, -1)}
                                        aria-label={`Naikkan penulis ${index + 1}`}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={index === authors.length - 1}
                                        onClick={() => moveAuthor(index, 1)}
                                        aria-label={`Turunkan penulis ${index + 1}`}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => removeAuthor(author.key)}
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
                                                options={fakultas.map((f) => ({
                                                    value: String(f.id),
                                                    label: f.nama_fakultas,
                                                }))}
                                                value={author.fakultasId}
                                                onValueChange={(value) =>
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
                                                        value: String(d.id),
                                                        label: d.nama_dosen,
                                                    }),
                                                )}
                                                value={author.dosenId}
                                                onValueChange={(value) =>
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
                                                          : author.dosenOptions
                                                                  .length === 0
                                                            ? "Tidak ada data dosen"
                                                            : "Pilih dosen"
                                                }
                                                searchPlaceholder="Cari dosen..."
                                                disabled={
                                                    !author.fakultasId ||
                                                    author.loadingDosen ||
                                                    author.dosenOptions
                                                        .length === 0
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
                                                value={author.nama_universitas}
                                                onChange={(e) =>
                                                    updateAuthorLuar(
                                                        author.key,
                                                        "nama_universitas",
                                                        e.target.value,
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
                                                value={author.nama_dosen}
                                                onChange={(e) =>
                                                    updateAuthorLuar(
                                                        author.key,
                                                        "nama_dosen",
                                                        e.target.value,
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
                                        value={author.nama_universitas}
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
                    <p className="text-sm text-red-500">{errors.authors}</p>
                )}
            </div>
        </>
    );
}
