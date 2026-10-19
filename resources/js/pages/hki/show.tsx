import { Form, Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { Hki } from "@/interface/hki";

interface Props {
    data: Hki;
    role: string;
}

function formatRupiah(value: string | number) {
    const number = Number(value);
    if (Number.isNaN(number)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
}

type PenulisRow =
    | {
          tipe: "internal";
          urutan: number;
          nama_dosen: string;
          asal: string;
      }
    | {
          tipe: "luar";
          urutan: number;
          nama_dosen: string;
          asal: string;
      };

export default function Show({ data, role }: Props) {
    const daftarPenulis: PenulisRow[] = [
        ...(data.penulis ?? []).map((p) => ({
            tipe: "internal" as const,
            urutan: p.urutan,
            nama_dosen: p.dosen?.nama_dosen ?? "-",
            asal: p.fakultas?.nama_fakultas ?? "-",
        })),
        ...(data.penulis_luar ?? []).map((p) => ({
            tipe: "luar" as const,
            urutan: p.urutan,
            nama_dosen: p.nama_dosen ?? "-",
            asal: p.nama_universitas ?? "-",
        })),
    ].sort((a, b) => a.urutan - b.urutan);

    const statusPengajuan =
        data.status_pengajuan.charAt(0).toUpperCase() +
        data.status_pengajuan.slice(1);

    return (
        <>
            <Head title={`Detail - ${data.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Link href={route(role + ".hki.index")} viewTransition>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>

                    {data.status_pengajuan === "diajukan" ||
                    data.status_pengajuan === "disetujui" ? (
                        ""
                    ) : (
                        <Link
                            href={route(role + ".hki.edit", data.id)}
                            viewTransition
                        >
                            <Button size="sm">
                                <Pencil className="mr-1 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    )}
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">{data.judul}</CardTitle>
                        <CardDescription>
                            Detail Hak Kekayaan Intelektual ( HKI )
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Info ringkas */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Semester
                                </p>
                                <p className="font-medium">{data.semester}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Tahun
                                </p>
                                <p className="font-medium">{data.tahun}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Sumber Dana
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                    {data.sumber_dana === "internal"
                                        ? "Internal"
                                        : "Eksternal"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Jumlah Dana
                                </p>
                                <p className="font-medium">
                                    {formatRupiah(data.jumlah_dana)}
                                </p>
                            </div>
                            {data.nomer_paten && (
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Nomor Paten
                                    </p>
                                    <p className="font-medium">
                                        {data.nomer_paten}
                                    </p>
                                </div>
                            )}
                            {data.nomer_pengajuan_haki && (
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Nomor Pengajuan HAKI
                                    </p>
                                    <p className="font-medium">
                                        {data.nomer_pengajuan_haki}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Abstrak */}
                        <div>
                            <p className="text-muted-foreground mb-1 text-sm">
                                Abstrak
                            </p>
                            <p className="text-sm leading-relaxed">
                                {data.abstrak}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                    Link Berkas
                                </p>
                                <Link
                                    href={data.link_berkas}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 underline"
                                    viewTransition
                                >
                                    <FileText className="h-4 w-4" />
                                    Lihat Berkas
                                </Link>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                    Status Pengajuan
                                </p>
                                <Badge
                                    variant={
                                        data.status_pengajuan === "ditolak"
                                            ? "destructive"
                                            : data.status_pengajuan ===
                                                "disetujui"
                                              ? "success"
                                              : "secondary"
                                    }
                                >
                                    {statusPengajuan}
                                </Badge>
                            </div>
                        </div>

                        {/* Daftar penulis */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-sm">
                                Penulis
                            </p>

                            {daftarPenulis.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    Belum ada data penulis.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>
                                                Fakultas / Universitas
                                            </TableHead>
                                            <TableHead>Keterangan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {daftarPenulis.map((p, index) => (
                                            <TableRow
                                                key={`${p.tipe}-${p.urutan}-${index}`}
                                            >
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {p.nama_dosen}
                                                </TableCell>
                                                <TableCell>{p.asal}</TableCell>
                                                <TableCell>
                                                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                                        {p.tipe === "internal"
                                                            ? "Internal"
                                                            : "Luar Universitas"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="grid justify-items-end">
                        {data.status_pengajuan === "diajukan" && (
                            <Form
                                className="flex gap-3"
                                action={route(
                                    "admin.hki.updateStatusPengajuan",
                                    data.id,
                                )}
                                method="PUT"
                            >
                                <Button
                                    name="status_pengajuan"
                                    value={"ditolak"}
                                    variant={"destructive"}
                                >
                                    Tolak
                                </Button>
                                <Button
                                    name="status_pengajuan"
                                    value={"disetujui"}
                                    variant={"success"}
                                >
                                    Setujui
                                </Button>
                            </Form>
                        )}
                        {data.status_pengajuan === "disetujui" && (
                            <Form
                                className="flex gap-3"
                                action={route(
                                    "admin.hki.updateStatusPengajuan",
                                    data.id,
                                )}
                                method="PUT"
                            >
                                <Button
                                    name="status_pengajuan"
                                    value={"ditolak"}
                                    variant={"destructive"}
                                >
                                    Tolak
                                </Button>
                            </Form>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: "Hak Kekayaan Intelektual",
            href: route("admin.hki.index"),
        },
        {
            title: "Detail",
            href: "#",
        },
    ],
};
