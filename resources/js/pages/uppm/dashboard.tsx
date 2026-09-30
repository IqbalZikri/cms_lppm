import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Book, Check, X } from "lucide-react";
import { User } from "@/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kegiatan } from "@/interface/kegiatan";
import { Pkm } from "@/interface/pkm";
import { Badge } from "@/components/ui/badge";
import { Hki } from "@/interface/hki";
import { LuaranJurnal } from "@/interface/luaran-jurnal";
import { LuaranProsiding } from "@/interface/luaran-prosiding";
import {
    ChartDashboardAdmin,
    ChartPoint,
} from "@/components/chart-dashboard-admin";
import { Dosen } from "@/types/dosen";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

interface Props {
    user: User;
    totalDosen: number;
    totalKegiatan: number;
    totalPkm: number;
    totalHki: number;
    totalLuaranJurnal: number;
    totalLuaranProsiding: number;
    dosenTerbaru: Dosen[];
    kegiatanTerbaru: Kegiatan[];
    pkmTerbaru: Pkm[];
    hkiTerbaru: Hki[];
    luaranJurnalTerbaru: LuaranJurnal[];
    luaranProsidingTerbaru: LuaranProsiding[];
}

export default function Dashboard({
    user,
    totalDosen,
    totalKegiatan,
    totalPkm,
    totalHki,
    totalLuaranJurnal,
    totalLuaranProsiding,
    dosenTerbaru,
    kegiatanTerbaru,
    pkmTerbaru,
    hkiTerbaru,
    luaranJurnalTerbaru,
    luaranProsidingTerbaru,
}: Props) {
    const namaUser = user.name.charAt(0).toUpperCase() + user.name.slice(1);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="font-bold text-3xl">
                    Selamat Datang {namaUser}
                </h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Dosen
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalDosen}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Total dosen terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kegiatan Penelitian
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalKegiatan}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Total kegiatan penelitian terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total PKM
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{totalPkm}</div>

                            <p className="text-muted-foreground text-xs">
                                Total PKM terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total HKI
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{totalHki}</div>

                            <p className="text-muted-foreground text-xs">
                                Total HKI terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Luaran Jurnal
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalLuaranJurnal}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Total luaran jurnal terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Luaran Prosiding
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalLuaranProsiding}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Total luaran prosiding terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <ChartAreaInteractive />

                <Card>
                    <CardHeader>
                        <CardTitle>Data Terbaru</CardTitle>
                        <CardDescription>Data tabel terbaru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="dosen">
                            <TabsList>
                                <TabsTrigger value="dosen">Dosen</TabsTrigger>
                                <TabsTrigger value="kegiatan">
                                    Penelitian Kegiatan
                                </TabsTrigger>
                                <TabsTrigger value="pkm">PKM</TabsTrigger>
                                <TabsTrigger value="hki">HKI</TabsTrigger>
                                <TabsTrigger value="luaranJurnal">
                                    Luaran Jurnal
                                </TabsTrigger>
                                <TabsTrigger value="luaranProsiding">
                                    Luaran Prosiding
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="dosen">
                                <Table>
                                    <TableCaption>
                                        Akun dosen terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Prodi</TableHead>
                                            <TableHead>NIDN</TableHead>
                                            <TableHead>NUPTK</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>
                                                Status Vertifikasi Email
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dosenTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <>
                                                        <TableCell
                                                            className="font-medium text-center"
                                                            colSpan={8}
                                                        >
                                                            Belum ada data.
                                                        </TableCell>
                                                    </>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {dosenTerbaru.map(
                                                    (item, index = 0) => (
                                                        <TableRow key={item.id}>
                                                            <>
                                                                <TableCell className="font-medium">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item
                                                                        .fakultas
                                                                        ?.nama_fakultas ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.prodi
                                                                        ?.nama_prodi ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.nidn ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.nuptk ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.nama_dosen ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.email ??
                                                                        "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.user
                                                                        .email_verified_at ? (
                                                                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                                                                            <Check />{" "}
                                                                            Terverifikasi
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge className="bg-red-500 text-white hover:bg-red-600">
                                                                            <X />
                                                                            Belum
                                                                            Terverifikasi
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="kegiatan">
                                <Table>
                                    <TableCaption>
                                        Data Kegiatan Penelitian Terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>
                                                Judul Kegiatan Penelitian
                                            </TableHead>
                                            <TableHead>Link Berkas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kegiatanTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <TableCell
                                                        className="font-medium text-center"
                                                        colSpan={5}
                                                    >
                                                        Data belum ada.
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {kegiatanTerbaru.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .fakultas
                                                                                    .nama_fakultas
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .dosen
                                                                                    .nama_dosen
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            {item.judul}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Link
                                                                href={
                                                                    item.link_berkas
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                Lihat Berkas
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="pkm">
                                <Table>
                                    <TableCaption>
                                        Data PKM Terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>Link Berkas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pkmTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <TableCell
                                                        className="font-medium text-center"
                                                        colSpan={5}
                                                    >
                                                        Data belum ada.
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {pkmTerbaru.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .fakultas
                                                                                    .nama_fakultas
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .dosen
                                                                                    .nama_dosen
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            {item.judul}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Link
                                                                href={
                                                                    item.link_berkas
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                Lihat Berkas
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="hki">
                                <Table>
                                    <TableCaption>
                                        Data HKI Terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>Link Berkas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hkiTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <TableCell
                                                        className="font-medium text-center"
                                                        colSpan={5}
                                                    >
                                                        Data belum ada.
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {hkiTerbaru.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .fakultas
                                                                                    .nama_fakultas
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    item.penulis ??
                                                                    []
                                                                ).map(
                                                                    (p, i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                        >
                                                                            {
                                                                                p
                                                                                    .dosen
                                                                                    .nama_dosen
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            {item.judul}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Link
                                                                href={
                                                                    item.link_berkas
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                Lihat Berkas
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="luaranJurnal">
                                <Table>
                                    <TableCaption>
                                        Data Luaran Jurnal Terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>Link Berkas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {luaranJurnalTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <TableCell
                                                        className="font-medium text-center"
                                                        colSpan={5}
                                                    >
                                                        Data belum ada.
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {luaranJurnalTerbaru.map(
                                                    (item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(
                                                                        item.penulis ??
                                                                        []
                                                                    ).map(
                                                                        (
                                                                            p,
                                                                            i,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                            >
                                                                                {
                                                                                    p
                                                                                        .fakultas
                                                                                        .nama_fakultas
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(
                                                                        item.penulis ??
                                                                        []
                                                                    ).map(
                                                                        (
                                                                            p,
                                                                            i,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                            >
                                                                                {
                                                                                    p
                                                                                        .dosen
                                                                                        .nama_dosen
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell>
                                                                {item.judul}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Link
                                                                    href={
                                                                        item.link_berkas
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 underline"
                                                                >
                                                                    Lihat Berkas
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="luaranProsiding">
                                <Table>
                                    <TableCaption>
                                        Data Luaran Prosiding Terbaru.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Fakultas</TableHead>
                                            <TableHead>Nama Dosen</TableHead>
                                            <TableHead>Link Berkas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {luaranProsidingTerbaru.length === 0 ? (
                                            <>
                                                <TableRow>
                                                    <TableCell
                                                        className="font-medium text-center"
                                                        colSpan={5}
                                                    >
                                                        Data belum ada.
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <>
                                                {luaranProsidingTerbaru.map(
                                                    (item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">
                                                                {index + 1}
                                                            </TableCell>

                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(
                                                                        item.penulis ??
                                                                        []
                                                                    ).map(
                                                                        (
                                                                            p,
                                                                            i,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                            >
                                                                                {
                                                                                    p
                                                                                        .fakultas
                                                                                        .nama_fakultas
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(
                                                                        item.penulis ??
                                                                        []
                                                                    ).map(
                                                                        (
                                                                            p,
                                                                            i,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="rounded-md bg-muted px-2 py-1 text-xs"
                                                                            >
                                                                                {
                                                                                    p
                                                                                        .dosen
                                                                                        .nama_dosen
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell>
                                                                {item.judul}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Link
                                                                    href={
                                                                        item.link_berkas
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 underline"
                                                                >
                                                                    Lihat Berkas
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: "Dashboard",
            href: route("admin.dashboard"),
        },
    ],
};
