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
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Form } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type SelectOption = {
    value: string | number;
    label: string;
};

type KolomInput = {
    name: string;
    label: string;
    type?: "text" | "email" | "number" | "select" | "password" | "radio";
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
    autoComplete?: string;
};

type DialogFormProps = {
    page: string;
    actionUrl: string;
    kolomInput: KolomInput[];
};

type DialogFormEditProps<T extends { id: number }> = {
    page: string;
    actionUrl: string; // URL yang SUDAH di-resolve pemanggil, mis. route('prodi.update', item.id)
    kolomInput: KolomInput[];
    item: T; // satu baris data, bukan array
};

type DialogDeleteProps<T extends { id: number }> = {
    page: string;
    actionUrl: string;
    item: T;
    label: string;
};

type DialogUpdateStatusProps<T extends { id: number }> = {
    page: string;
    actionUrl: string;
    item: T;
    label: string;
    status_published: string;
};

export default function DialogFormCreate({
    page,
    actionUrl,
    kolomInput,
}: DialogFormProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="mb-[20px] w-[200px]">
                    <Plus className="h-4 w-4" />
                    Tambah {page}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah {page}</DialogTitle>
                </DialogHeader>
                <Form
                    action={route(actionUrl)}
                    method="POST"
                    onSuccess={() => setOpen(false)}
                    resetOnSuccess
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                {kolomInput.map((kolom) => (
                                    <Field key={kolom.name}>
                                        <Label htmlFor={kolom.name}>
                                            {kolom.label}{" "}
                                            {kolom.required && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>

                                        {kolom.type === "select" ? (
                                            <Select
                                                name={kolom.name}
                                                required={kolom.required}
                                            >
                                                <SelectTrigger id={kolom.name}>
                                                    <SelectValue
                                                        placeholder={
                                                            kolom.placeholder ??
                                                            `Pilih ${kolom.label}`
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kolom.options?.map(
                                                        (opt) => (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={String(
                                                                    opt.value,
                                                                )}
                                                            >
                                                                {opt.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <>
                                                {kolom.type === "radio" ? (
                                                    <RadioGroup
                                                        name={kolom.name}
                                                    >
                                                        {kolom.options?.map(
                                                            (item: any) => (
                                                                <div className="flex items-center gap-3">
                                                                    <RadioGroupItem
                                                                        value={
                                                                            item.value
                                                                        }
                                                                        id={
                                                                            item.value
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={
                                                                            item.value
                                                                        }
                                                                    >
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </Label>
                                                                </div>
                                                            ),
                                                        )}
                                                    </RadioGroup>
                                                ) : (
                                                    <Input
                                                        id={kolom.name}
                                                        name={kolom.name}
                                                        type={
                                                            kolom.type ?? "text"
                                                        }
                                                        placeholder={
                                                            kolom.placeholder
                                                        }
                                                        required={
                                                            kolom.required
                                                        }
                                                        autoComplete={
                                                            kolom.autoComplete
                                                        }
                                                    />
                                                )}
                                            </>
                                        )}

                                        {errors[kolom.name] && (
                                            <p className="text-sm text-red-500">
                                                {errors[kolom.name]}
                                            </p>
                                        )}
                                    </Field>
                                ))}
                            </FieldGroup>
                            <DialogFooter className="mt-[20px]">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Kembali
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "...Menyimpan" : "Simpan"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function DialogFormEdit<T extends { id: number }>({
    page,
    actionUrl,
    kolomInput,
    item,
}: DialogFormEditProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {page}</DialogTitle>
                </DialogHeader>
                <Form
                    action={actionUrl}
                    method="put"
                    onSuccess={() => setOpen(false)}
                    resetOnSuccess
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                {kolomInput.map((kolom) => {
                                    const currentValue = (item as any)[
                                        kolom.name
                                    ];

                                    return (
                                        <Field key={kolom.name}>
                                            <Label htmlFor={kolom.name}>
                                                {kolom.label}{" "}
                                                {kolom.required && (
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                )}
                                            </Label>

                                            {kolom.type === "select" ? (
                                                <Select
                                                    name={kolom.name}
                                                    required={kolom.required}
                                                    defaultValue={
                                                        currentValue != null
                                                            ? String(
                                                                  currentValue,
                                                              )
                                                            : undefined
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={kolom.name}
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                kolom.placeholder ??
                                                                `Pilih ${kolom.label}`
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {kolom.options?.map(
                                                            (opt) => (
                                                                <SelectItem
                                                                    key={
                                                                        opt.value
                                                                    }
                                                                    value={String(
                                                                        opt.value,
                                                                    )}
                                                                >
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <>
                                                    {kolom.type == "radio" ? (
                                                        <RadioGroup
                                                            name={kolom.name}
                                                        >
                                                            {kolom.options?.map(
                                                                (item: any) => (
                                                                    <div className="flex items-center gap-3">
                                                                        <RadioGroupItem
                                                                        defaultValue={ currentValue ?? ""}
                                                                            value={
                                                                                item.value
                                                                            }
                                                                            id={
                                                                                item.value
                                                                            }
                                                                        />
                                                                        <Label
                                                                            htmlFor={
                                                                                item.value
                                                                            }
                                                                        >
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </Label>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </RadioGroup>
                                                    ) : (
                                                        <Input
                                                            id={kolom.name}
                                                            name={kolom.name}
                                                            type={
                                                                kolom.type ??
                                                                "text"
                                                            }
                                                            placeholder={
                                                                kolom.placeholder
                                                            }
                                                            required={
                                                                kolom.required
                                                            }
                                                            autoComplete={
                                                                kolom.autoComplete
                                                            }
                                                            defaultValue={
                                                                currentValue ??
                                                                ""
                                                            }
                                                        />
                                                    )}
                                                </>
                                            )}

                                            {errors[kolom.name] && (
                                                <p className="text-sm text-red-500">
                                                    {errors[kolom.name]}
                                                </p>
                                            )}
                                        </Field>
                                    );
                                })}
                            </FieldGroup>
                            <DialogFooter className="mt-[20px]">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Kembali
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function DialogDelete<T extends { id: number }>({
    page,
    item,
    actionUrl,
    label,
}: DialogDeleteProps<T>) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <Dialog
            open={deleteId === item.id}
            onOpenChange={(isOpen) => {
                setDeleteId(isOpen ? item.id : null);
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="destructive">
                    Hapus
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form
                    action={actionUrl}
                    method="DELETE"
                    onSuccess={() => setDeleteId(null)}
                    resetOnSuccess
                >
                    {({ processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    Hapus{" "}
                                    {page.charAt(0).toUpperCase() +
                                        page.slice(1)}
                                </DialogTitle>
                                <DialogDescription>
                                    Apakah anda yakin ingin menghapus {page}{" "}
                                    {label}?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant={"outline"}>
                                        Kembali
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant={"destructive"}
                                >
                                    {processing ? "...Menghapus" : "Hapus"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function DialogUpdateStatus<T extends { id: number }>({
    page,
    actionUrl,
    item,
    label,
    status_published,
}: DialogUpdateStatusProps<T>) {
    const [statusId, setStatusId] = useState<number | null>(null);

    return (
        <Dialog
            open={statusId === item.id}
            onOpenChange={(isOpen) => {
                setStatusId(isOpen ? item.id : null);
            }}
        >
            <DialogTrigger asChild>
                {status_published === "draft" ? (
                    <Button
                        type="submit"
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Published
                    </Button>
                ) : (
                    <Button type="submit" variant="default">
                        Draft
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <Form
                    action={actionUrl}
                    method="PUT"
                    onSuccess={() => setStatusId(null)}
                    resetOnSuccess
                >
                    {({ processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    Update Status{" "}
                                    {page.charAt(0).toUpperCase() +
                                        page.slice(1)}
                                </DialogTitle>
                                <DialogDescription>
                                    Apakah anda yakin ingin mengupdate {page}{" "}
                                    {label}?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant={"outline"}>
                                        Kembali
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant={"default"}
                                >
                                    {processing ? "...Mengupdate" : "Update"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
