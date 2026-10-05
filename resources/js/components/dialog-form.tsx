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
    showIf?: { name: string; value: string };
    small?: string;
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

type DialogArchivedProps<T extends { id: number }> = {
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
    const [values, setValues] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                setOpen(state);
                if (!state) setValues({}); // reset saat dialog ditutup
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" className="w-[200px]">
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
                    onSuccess={() => {
                        setOpen(false);
                        setValues({});
                    }}
                    resetOnSuccess
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                {kolomInput
                                    // Sembunyikan kolom jika syarat showIf tidak terpenuhi
                                    .filter(
                                        (kolom) =>
                                            !kolom.showIf ||
                                            values[kolom.showIf.name] ===
                                                kolom.showIf.value,
                                    )
                                    .map((kolom) => (
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
                                                <>
                                                    <Select
                                                        name={kolom.name}
                                                        required={
                                                            kolom.required
                                                        }
                                                        onValueChange={(v) =>
                                                            handleChange(
                                                                kolom.name,
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id={kolom.name}
                                                        >
                                                            <SelectValue
                                                                placeholder={`Pilih ${kolom.label}`}
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
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <small>
                                                        Pastikan data{" "}
                                                        {kolom.label} sudah
                                                        terdaftar di sistem.
                                                    </small>
                                                </>
                                            ) : kolom.type === "radio" ? (
                                                <RadioGroup
                                                    name={kolom.name}
                                                    onValueChange={(v) =>
                                                        handleChange(
                                                            kolom.name,
                                                            v,
                                                        )
                                                    }
                                                >
                                                    {kolom.options?.map(
                                                        (item: any) => (
                                                            <div
                                                                key={item.value}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <RadioGroupItem
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    id={`${kolom.name}-${item.value}`}
                                                                />
                                                                <Label
                                                                    htmlFor={`${kolom.name}-${item.value}`}
                                                                >
                                                                    {item.label}
                                                                </Label>
                                                            </div>
                                                        ),
                                                    )}
                                                </RadioGroup>
                                            ) : (
                                                <>
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
    const getInitialValues = () =>
        Object.fromEntries(
            kolomInput.map((kolom) => [
                kolom.name,
                String((item as any)[kolom.name] ?? ""),
            ]),
        ) as Record<string, string>;

    const [values, setValues] =
        useState<Record<string, string>>(getInitialValues);

    const handleChange = (name: string, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                setOpen(state);
                if (state) setValues(getInitialValues()); // reset saat dialog ditutup
            }}
        >
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
                    onSuccess={() => {
                        setOpen(false);
                        setValues({});
                    }}
                    resetOnSuccess
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                {kolomInput
                                    // Sembunyikan kolom jika syarat showIf tidak terpenuhi
                                    .filter(
                                        (kolom) =>
                                            !kolom.showIf ||
                                            values[kolom.showIf.name] ===
                                                kolom.showIf.value,
                                    )
                                    .map((kolom) => {
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
                                                        required={
                                                            kolom.required
                                                        }
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
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <>
                                                        {kolom.type ==
                                                        "radio" ? (
                                                            <RadioGroup
                                                                name={
                                                                    kolom.name
                                                                }
                                                                defaultValue={
                                                                    currentValue ??
                                                                    ""
                                                                }
                                                                onValueChange={(
                                                                    v,
                                                                ) =>
                                                                    handleChange(
                                                                        kolom.name,
                                                                        v,
                                                                    )
                                                                }
                                                            >
                                                                {kolom.options?.map(
                                                                    (
                                                                        opt: any,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                opt.value
                                                                            }
                                                                            className="flex items-center gap-3"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={
                                                                                    opt.value
                                                                                }
                                                                                id={`edit-${item.id}-${kolom.name}-${opt.value}`}
                                                                            />
                                                                            <Label
                                                                                htmlFor={`edit-${item.id}-${kolom.name}-${opt.value}`}
                                                                            >
                                                                                {
                                                                                    opt.label
                                                                                }
                                                                            </Label>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </RadioGroup>
                                                        ) : (
                                                            <>
                                                                <Input
                                                                    id={
                                                                        kolom.name
                                                                    }
                                                                    name={
                                                                        kolom.name
                                                                    }
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
                                                                {kolom.small ? (
                                                                    <small>
                                                                        {
                                                                            kolom.small
                                                                        }
                                                                    </small>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </>
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
                        Publish
                    </Button>
                ) : status_published === "archived" ? (
                    <Button
                        type="submit"
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Publish
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

export function DialogArchived<T extends { id: number }>({
    page,
    actionUrl,
    item,
    label,
    status_published,
}: DialogArchivedProps<T>) {
    const [statusId, setStatusId] = useState<number | null>(null);

    return (
        <Dialog
            open={statusId === item.id}
            onOpenChange={(isOpen) => {
                setStatusId(isOpen ? item.id : null);
            }}
        >
            <DialogTrigger asChild>
                {status_published === "archived" ? (
                    <Button className="bg-gray-600 text-white" disabled>
                        Diarsipkan
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="bg-gray-500 text-white hover:bg-gray-600"
                    >
                        Arsipkan
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
                                    Apakah anda yakin ingin mengarsipkan {page}{" "}
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
                                    {processing
                                        ? "...Mengarsipkan"
                                        : "Arsipkan"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
