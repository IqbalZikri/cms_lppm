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
import { LuaranJurnal } from "@/interface/luaran-jurnal";

interface Props {
    data: LuaranJurnal;
    role: string;
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

    return (
        <>
            <Head title={`Detail - ${data.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Link
                        href={route(role + ".luaran_jurnal.index")}
                        viewTransition
                    >
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>

                    <Link
                        href={route(role + ".luaran_jurnal.edit", data.id)}
                        viewTransition
                    >
                        <Button size="sm">
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">{data.judul}</CardTitle>
                        <CardDescription>Detail Luaran Jurnal</CardDescription>
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
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: "Luaran Jurnal",
            href: route("admin.luaran_jurnal.index"),
        },
        {
            title: "Detail",
            href: "#",
        },
    ],
};
