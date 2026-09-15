import { Head } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

interface Fakultas {
    id: number;
    kode_fakultas: number;
    nama_fakultas: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

interface FakultasPageProps {
    data: PaginatedData<Fakultas>;
}

export default function Fakultas({ data }: FakultasPageProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <>
            <Head title="Fakultas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger render={<Button />}>
                        Tambah Fakultas
                    </DrawerTrigger>
                </Drawer>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead>Kode Fakultas</TableHead>
                            <TableHead>Nama Fakultas</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.kode_fakultas}</TableCell>
                                <TableCell>{item.nama_fakultas}</TableCell>
                                <TableCell className="flex gap-[20px]">
                                    <Button>Edit</Button>
                                    <Button>Hapus</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

Fakultas.layout = {
    breadcrumbs: [
        {
            title: "Fakultas",
            href: "/fakultas",
        },
    ],
};
