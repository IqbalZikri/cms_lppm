import { Head } from "@inertiajs/react";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { route } from "ziggy-js";
import Header from "@/components/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Book } from "lucide-react";
import { Dosen } from "@/types/dosen";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
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

interface Props {
    dosen: Dosen[];
    kegiatan: Kegiatan[];
    pkm: Pkm[];
    user: User;
}

export default function Dashboard({ dosen, kegiatan, pkm, user }: Props) {
    const namaUser = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    const totalKegiatan = kegiatan.length;
    const totalDosen = dosen.length;
    const totalPkm = pkm.length;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="font-bold text-3xl">
                    Selamat Datang {namaUser}
                </h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            <div className="text-2xl font-bold"></div>

                            <p className="text-muted-foreground text-xs">
                                Total jurnal terdaftar dalam sistem
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
                                        {dosen.length === 0 ? (
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
                                                {dosen.map(
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
                                                                        .email_verified_at ??
                                                                        "-"}
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
                                        {kegiatan.length === 0 ? (
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
                                                {kegiatan.map((item, index = 0) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.fakultas.nama_fakultas}
                                                        </TableCell>
                                                        <TableCell>
                                                            Credit Card
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            $250.00
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
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
