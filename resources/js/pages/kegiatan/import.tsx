import { Head, Link, router } from "@inertiajs/react";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    FileSpreadsheet,
    Loader2,
    Upload,
} from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type PreviewRow = {
    row: number;
    data: Record<string, string | number | null>;
    errors: string[];
};

type Preview = {
    total: number;
    valid: number;
    invalid: number;
    rows: PreviewRow[];
};

const COLUMNS: { key: string; label: string }[] = [
    { key: "nidn", label: "NIDN" },
    { key: "judul", label: "Judul" },
    { key: "semester", label: "Semester" },
    { key: "tahun", label: "Tahun" },
    { key: "link_berkas", label: "Link berkas" },
];

function getXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [importing, setImporting] = useState(false);
    const [onlyInvalid, setOnlyInvalid] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFile(e.target.files?.[0] ?? null);
        setPreview(null);
        setError(null);
        setOnlyInvalid(false);
    }

    async function handlePreview() {
        if (!file) return;

        setLoadingPreview(true);
        setError(null);
        setPreview(null);

        const body = new FormData();
        body.append("file", file);

        try {
            const res = await fetch(route("kegiatan.preview"), {
                method: "POST",
                body,
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                    "X-XSRF-TOKEN": getXsrfToken(),
                },
            });

            const json = await res.json();

            if (!res.ok) {
                setError(
                    json.errors?.file?.[0] ??
                        json.message ??
                        "Gagal membaca file.",
                );
                return;
            }

            setPreview(json);
        } catch {
            setError("Terjadi kesalahan saat membaca file. Coba lagi.");
        } finally {
            setLoadingPreview(false);
        }
    }

    function handleImport() {
        if (!file) return;

        router.post(
            route("luaran_jurnal.import"),
            { file },
            {
                forceFormData: true,
                onStart: () => {
                    setImporting(true);
                    setError(null);
                },
                onFinish: () => setImporting(false),
                onError: (errors) => setError(Object.values(errors).join(" ")),
            },
        );
    }

    const visibleRows =
        preview?.rows.filter((r) => !onlyInvalid || r.errors.length > 0) ?? [];

    return (
        <>
            <Head title="Import Page Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href={route("luaran_jurnal.index")} viewTransition>
                    <Button>
                        <ArrowLeft />
                        Kembali
                    </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>1. Pilih file</CardTitle>
                        <CardDescription>
                            Format .xlsx, .xls, atau .csv (maks. 5 MB). Baris
                            pertama harus berisi heading:{" "}
                            <code className="text-xs">
                                sintaid, nidn, nama, fakultas, prodi, email,
                                pendidikan_terakhir, jabatan_fungsional,
                                gelar_depan, gelar_belakang
                            </code>
                            . Format kolom NIDN dan SINTA ID sebagai teks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            className="sm:max-w-md"
                        />
                        <Button
                            onClick={handlePreview}
                            disabled={!file || loadingPreview || importing}
                        >
                            {loadingPreview ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <FileSpreadsheet />
                            )}
                            Preview data
                        </Button>

                        <Button variant={"success"}>
                            <a href="/format_import_jurnal.xlsx" className="">
                                Contoh Format Import Jurnal
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertTitle>Terjadi masalah</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {preview && (
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Periksa data</CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    Total: {preview.total}
                                </Badge>
                                <Badge className="bg-green-600 text-white hover:bg-green-600">
                                    Valid: {preview.valid}
                                </Badge>
                                <Badge
                                    variant={
                                        preview.invalid > 0
                                            ? "destructive"
                                            : "secondary"
                                    }
                                >
                                    Bermasalah: {preview.invalid}
                                </Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {preview.invalid > 0 ? (
                                <Alert>
                                    <AlertCircle />
                                    <AlertTitle>
                                        Ada baris yang akan dilewati
                                    </AlertTitle>
                                    <AlertDescription>
                                        {preview.invalid} baris bermasalah tidak
                                        akan diimport. Baris yang valid (
                                        {preview.valid}) tetap diproses.
                                        Perbaiki baris tersebut di Excel lalu
                                        import ulang jika ingin memasukkannya.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert>
                                    <CheckCircle2 />
                                    <AlertTitle>Semua baris valid</AlertTitle>
                                    <AlertDescription>
                                        Data siap diimport. Akun yang belum ada
                                        akan dibuat otomatis, dan dosen dengan
                                        NIDN yang sudah terdaftar akan
                                        diperbarui.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {preview.invalid > 0 && (
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={onlyInvalid}
                                        onChange={(e) =>
                                            setOnlyInvalid(e.target.checked)
                                        }
                                    />
                                    Tampilkan hanya baris bermasalah
                                </label>
                            )}

                            <div className="max-h-[60vh] overflow-auto rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background">
                                        <TableRow>
                                            <TableHead>Baris</TableHead>
                                            <TableHead>Status</TableHead>
                                            {COLUMNS.map((c) => (
                                                <TableHead key={c.key}>
                                                    {c.label}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visibleRows.map((r) => {
                                            const bad = r.errors.length > 0;
                                            return (
                                                <TableRow
                                                    key={r.row}
                                                    className={
                                                        bad
                                                            ? "bg-destructive/10"
                                                            : undefined
                                                    }
                                                >
                                                    <TableCell>
                                                        {r.row}
                                                    </TableCell>
                                                    <TableCell className="min-w-56">
                                                        {bad ? (
                                                            <ul className="list-disc pl-4 text-xs text-destructive">
                                                                {r.errors.map(
                                                                    (e, i) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {e}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <CheckCircle2 className="size-4 text-green-600" />
                                                        )}
                                                    </TableCell>
                                                    {COLUMNS.map((c) => (
                                                        <TableCell key={c.key}>
                                                            {r.data[c.key] ??
                                                                "-"}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {preview.total > preview.rows.length && (
                                <p className="text-xs text-muted-foreground">
                                    Menampilkan {preview.rows.length} dari{" "}
                                    {preview.total} baris. Seluruh baris tetap
                                    divalidasi saat import.
                                </p>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleImport}
                                    disabled={preview.valid === 0 || importing}
                                >
                                    {importing ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Upload />
                                    )}
                                    Import {preview.valid} data valid
                                    {preview.invalid > 0 &&
                                        `, lewati ${preview.invalid} baris`}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Import.layout = {
    breadcrumbs: [
        {
            title: "Kegiatan",
            href: route("kegiatan.index"),
        },
        {
            title: "Import data Kegiatan",
            href: route("kegiatan.pageImport"),
        },
    ],
};
