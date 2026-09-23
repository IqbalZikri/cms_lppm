import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Card,
    CardContent,
    CardDescription,
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
import { Pkm } from "@/interface/pkm";

interface Props {
    data: Pkm;
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

export default function Show({ data }: Props) {
    const penulis = data.penulis ?? [];

    return (
        <>
            <Head title={`Detail - ${data.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Link href={route("admin.kegiatan.index")} viewTransition>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>

                    <Link href={route("admin.kegiatan.edit", data.id)} viewTransition>
                        <Button size="sm">
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {data.judul}
                        </CardTitle>
                        <CardDescription>
                            Detail Pengabdian Kepada Masyarakat ( PKM )
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

                        {/* Link berkas */}
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

                        {/* Daftar penulis */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-sm">
                                Penulis
                            </p>

                            {penulis.length === 0 ? (
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
                                            <TableHead>Fakultas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {penulis.map((p, index) => (
                                            <TableRow
                                                key={`${p.dosen_id}-${index}`}
                                            >
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {p.nama_dosen ?? "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {p.nama_fakultas ?? "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: "Kegiatan Penelitian",
            href: route("admin.kegiatan.index"),
        },
        {
            title: "Detail",
            href: "#",
        },
    ],
};
