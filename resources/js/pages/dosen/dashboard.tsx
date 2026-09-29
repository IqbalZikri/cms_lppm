import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import StatisticsCard from "@/components/statistic-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Hki } from "@/interface/hki";
import { Kegiatan } from "@/interface/kegiatan";
import { LuaranJurnal } from "@/interface/luaran-jurnal";
import { LuaranProsiding } from "@/interface/luaran-prosiding";
import { Pkm } from "@/interface/pkm";
import { Auth } from "@/types";
import { Dosen } from "@/types/dosen";
import { Head, Link } from "@inertiajs/react";

interface Props {
    dosenLogin: Dosen;
    totalKegiatan: number;
    totalPkm: number;
    totalHki: number;
    totalLuaranJurnal: number;
    totalLuaranProsiding: number;
    kegiatanTerbaru: Kegiatan[];
    pkmTerbaru: Pkm[];
    hkiTerbaru: Hki[];
    luaranJurnalTerbaru: LuaranJurnal[];
    luaranProsidingTerbaru: LuaranProsiding[];
}

export default function Dashboard({
    dosenLogin,
    totalKegiatan,
    totalPkm,
    totalHki,
    totalLuaranJurnal,
    totalLuaranProsiding,
    kegiatanTerbaru,
    pkmTerbaru,
    hkiTerbaru,
    luaranJurnalTerbaru,
    luaranProsidingTerbaru,
}: Props) {
    console.log(dosenLogin);

    return (
        <>
            <Head title="Dashboard Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="font-bold text-3xl">
                    Selamat Datang {dosenLogin.nama_dosen}
                </h1>
                <StatisticsCard
                    className="lg:grid-cols-3"
                    dataCard={[
                        {
                            label: "Total Penelitian",
                            count: dosenLogin.penulis.length,
                        },
                        {
                            label: "Total Kegiatan",
                            count: totalKegiatan,
                        },
                        {
                            label: "Total PKM",
                            count: totalPkm,
                        },
                        {
                            label: "Total HKI",
                            count: totalHki,
                        },
                        {
                            label: "Total Luaran Jurnal",
                            count: totalLuaranJurnal,
                        },
                        {
                            label: "Total Luaran Prosiding",
                            count: totalLuaranProsiding,
                        },
                    ]}
                />

                <ChartAreaInteractive />

                <Card>
                    <CardHeader>
                        <CardTitle>Data Terbaru</CardTitle>
                        <CardDescription>Data tabel terbaru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="kegiatan">
                            <TabsList>
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
                                                {kegiatanTerbaru.map(
                                                    (item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">
                                                                {index + 1}
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
                                                {pkmTerbaru.map(
                                                    (item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">
                                                                {index + 1}
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
                                                {hkiTerbaru.map(
                                                    (item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">
                                                                {index + 1}
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
            title: "Dashboard Dosen",
        },
    ],
};
