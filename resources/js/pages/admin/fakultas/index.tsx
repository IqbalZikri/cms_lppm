import { Form, Head, Link, router } from "@inertiajs/react";
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
import { FormEvent, useState } from "react";
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";
import TablePage from "@/components/table-page";
import { DialogDelete, DialogFormEdit } from "@/components/dialog-form";
import { PaginatedData } from "@/interface/pagination";

interface Fakultas {
    id: number;
    kode_fakultas: string;
    nama_fakultas: string;
}

type FakultasPageProps = {
    data: PaginatedData<Fakultas>;
    filters: any;
};

export default function Fakultas({ data, filters }: FakultasPageProps) {
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.fakultas.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Fakultas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Fakultas
                        </h1>

                        <p className="text-muted-foreground">
                            Kelola dan lihat seluruh data fakultas universitas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("admin.fakultas.index")}
                                    >
                                        Fakultas
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                                <Building2 className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle>Daftar Fakultas</CardTitle>

                                <p className="text-muted-foreground mt-1 text-sm">
                                    Informasi fakultas yang terdaftar dalam
                                    sistem.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 items-center lg:block xl:flex">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-3 mb-[10px] xl:mb-[0px]"
                            >
                                <Field orientation={"horizontal"}>
                                    <Input
                                        type="search"
                                        placeholder="Cari Disini..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <Button type="submit">Cari</Button>
                                </Field>
                            </form>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        className="w-[200px]"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Fakultas
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <Form
                                        action={route("admin.fakultas.store")}
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
                                                                {
                                                                    errors.kode_fakultas
                                                                }
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
                                                                {
                                                                    errors.nama_fakultas
                                                                }
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
                        </div>
                    </CardHeader>

                    <CardContent>
                        <TablePage<Fakultas>
                            data={data}
                            columns={[
                                {
                                    key: "kode_fakultas",
                                    label: "Kode Fakultas",
                                },
                                {
                                    key: "nama_fakultas",
                                    label: "Nama Fakultas",
                                },
                            ]}
                            renderActions={(item) => (
                                <>
                                    <DialogFormEdit
                                        page="Fakultas"
                                        actionUrl={route(
                                            "admin.fakultas.update",
                                            item.id,
                                        )}
                                        item={item}
                                        kolomInput={[
                                            {
                                                name: "kode_fakultas",
                                                label: "Kode Fakultas",
                                                required: true,
                                            },
                                            {
                                                name: "nama_fakultas",
                                                label: "Nama Fakultas",
                                                required: true,
                                            },
                                        ]}
                                    />
                                    <DialogDelete
                                        page="Fakultas"
                                        actionUrl={route(
                                            "admin.fakultas.destroy",
                                            item.id,
                                        )}
                                        item={item}
                                        label={item.nama_fakultas}
                                    />
                                </>
                            )}
                        />
                    </CardContent>
                </Card>
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
