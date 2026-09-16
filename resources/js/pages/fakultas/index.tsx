import { Form, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";

interface Fakultas {
    id: number;
    kode_fakultas: string;
    nama_fakultas: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    length: number;
    map: any;
}

interface FakultasPageProps {
    data: PaginatedData<Fakultas>;
}

export default function Fakultas({ data }: FakultasPageProps) {
    const [open, setOpen] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <>
            <Head title="Fakultas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" className="w-[200px]">
                            Tambah Fakultas
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <Form
                            action={route("fakultas.store")}
                            method="post"
                            onSuccess={() => setOpen(false)}
                            resetOnSuccess
                        >
                            {({ errors, processing }) => (
                                <>
                                    <DialogHeader className="mb-[25px]">
                                        <DialogTitle>
                                            Tambah Data Fakultas
                                        </DialogTitle>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label htmlFor="kode_fakultas">
                                                Kode Fakultas{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                name="kode_fakultas"
                                                id="kode_fakultas"
                                                placeholder="Kode Fakultas"
                                                autoComplete="off"
                                                required
                                            />
                                            {errors.kode_fakultas && (
                                                <p className="text-sm text-red-500">
                                                    {errors.kode_fakultas}
                                                </p>
                                            )}
                                        </Field>
                                        <Field>
                                            <Label htmlFor="nama_fakultas">
                                                Nama Fakultas{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                name="nama_fakultas"
                                                id="nama_fakultas"
                                                placeholder="Nama Fakultas"
                                                autoComplete="off"
                                                required
                                            />
                                            {errors.nama_fakultas && (
                                                <p className="text-sm text-red-500">
                                                    {errors.nama_fakultas}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                            >
                                                Kembali
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
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
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Data Fakultas Belum Diisi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.kode_fakultas}</TableCell>
                                    <TableCell>{item.nama_fakultas}</TableCell>
                                    <TableCell className="flex gap-[20px]">
                                        <Dialog
                                            open={editingId === item.id}
                                            onOpenChange={(isOpen) => {
                                                setEditingId(
                                                    isOpen ? item.id : null,
                                                );
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button type="button">
                                                    Edit
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <Form
                                                    action={route(
                                                        "fakultas.update",
                                                        item.id,
                                                    )}
                                                    method="PUT"
                                                    onSuccess={() =>
                                                        setEditingId(null)
                                                    }
                                                    resetOnSuccess
                                                >
                                                    {({
                                                        errors,
                                                        processing,
                                                    }) => (
                                                        <>
                                                            <DialogHeader className="mb-[25px]">
                                                                <DialogTitle>
                                                                    Edit Data
                                                                    Fakultas
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <FieldGroup>
                                                                <Field>
                                                                    <Label htmlFor="kode_fakultas-${item.id}">
                                                                        Kode
                                                                        Fakultas{" "}
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <Input
                                                                        name="kode_fakultas"
                                                                        placeholder="Kode Fakultas"
                                                                        id={
                                                                            "kode_fakultas-${item.id}"
                                                                        }
                                                                        defaultValue={
                                                                            item.kode_fakultas
                                                                        }
                                                                        required
                                                                    />
                                                                    {errors.kode_fakultas && (
                                                                        <p className="text-sm text-danger">
                                                                            {
                                                                                errors.kode_fakultas
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </Field>
                                                                <Field>
                                                                    <Label htmlFor="nama_fakultas-${item.id}">
                                                                        Nama
                                                                        Fakultas
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </Label>
                                                                    <Input
                                                                        name="nama_fakultas"
                                                                        placeholder="Nama Fakultas"
                                                                        id={
                                                                            "nama_fakultas-${item.id}"
                                                                        }
                                                                        defaultValue={
                                                                            item.nama_fakultas
                                                                        }
                                                                        required
                                                                    />
                                                                    {errors.nama_fakultas && (
                                                                        <p className="text-sm text-danger">
                                                                            {
                                                                                errors.nama_fakultas
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </Field>
                                                            </FieldGroup>
                                                            <DialogFooter>
                                                                <DialogClose>
                                                                    <Button
                                                                        type="button"
                                                                        variant={
                                                                            "outline"
                                                                        }
                                                                    >
                                                                        Kembali
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                >
                                                                    {processing
                                                                        ? "Menyimpan"
                                                                        : "Simpan"}
                                                                </Button>
                                                            </DialogFooter>
                                                        </>
                                                    )}
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog
                                            open={deleteId === item.id}
                                            onOpenChange={(isOpen) => {
                                                setDeleteId(
                                                    isOpen ? item.id : null,
                                                );
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                >
                                                    Hapus
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <Form
                                                    action={route(
                                                        "fakultas.destroy",
                                                        item.id,
                                                    )}
                                                    method="DELETE"
                                                    onSuccess={() =>
                                                        setDeleteId(null)
                                                    }
                                                    resetOnSuccess
                                                >
                                                    {({ processing }) => (
                                                        <>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Hapus
                                                                    Fakultas
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    fakultas{" "}
                                                                    {
                                                                        item.nama_fakultas
                                                                    }
                                                                    ?
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <DialogClose>
                                                                    <Button
                                                                        type="button"
                                                                        variant={
                                                                            "outline"
                                                                        }
                                                                    >
                                                                        Kembali
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    variant={
                                                                        "destructive"
                                                                    }
                                                                >
                                                                    {processing
                                                                        ? "...Menghapus"
                                                                        : "Hapus"}
                                                                </Button>
                                                            </DialogFooter>
                                                        </>
                                                    )}
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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
