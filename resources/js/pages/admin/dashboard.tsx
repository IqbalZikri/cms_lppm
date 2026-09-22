import { Head } from "@inertiajs/react";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { route } from "ziggy-js";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Props {
    dosens: number;
    // penelitian: number;
    // pkm: number;
    jurnal: number;
    user: User;
}

export default function Dashboard({
    dosens,
    // penelitian,
    // pkm,
    // jurnal,
    user,
}: Props) {
    const namaUser = user.name.charAt(0).toUpperCase() + user.name.slice(1);
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
                            <div className="text-2xl font-bold">{dosens}</div>

                            <p className="text-muted-foreground text-xs">
                                Total dosen terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Penelitian
                            </CardTitle>

                            <Book className="text-muted-foreground h-5 w-5" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {/* {penelitian} */}
                            </div>

                            <p className="text-muted-foreground text-xs">
                                Total penelitian terdaftar dalam sistem
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
                            <div className="text-2xl font-bold"></div>

                            <p className="text-muted-foreground text-xs">
                                Total PKM terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Jurnal
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
                <Tabs defaultValue="" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Dosen</TabsTrigger>
                        <TabsTrigger value="password">PKM</TabsTrigger>
                        <TabsTrigger value="password">Jurnal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        Make changes to your account here.
                    </TabsContent>
                    <TabsContent value="password">
                        Change your password here.
                    </TabsContent>
                </Tabs>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">
                                INV001
                            </TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right">
                                $250.00
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
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
