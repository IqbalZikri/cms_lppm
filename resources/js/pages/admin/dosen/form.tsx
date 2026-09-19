import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas } from "@/interface/fakultas";
import { Prodi } from "@/interface/prodi";
import { Dosen } from "@/types/dosen";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Contact,
    ImageUp,
    Loader2,
    Save,
    User,
    UserRound,
    X,
} from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { route } from "ziggy-js";
import { cn } from "@/lib/utils";
import { Value } from "@radix-ui/react-select";
import { User as UserInterface } from "@/interface/user";

interface Props {
    fakultas: Fakultas[];
    dosen?: Dosen;
    user?: UserInterface;
}

/** Small red asterisk shown next to labels for required fields. */
function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

function getNamaDosenValue(text: string) {
    return text;
}

export default function DosenForm({ fakultas, dosen, user }: Props) {
    const isEdit = !!dosen && !!user;

    const [preview, setPreview] = useState<string | null>(dosen?.foto ?? null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        fakultas_id: dosen ? String(dosen.fakultas_id) : "",
        prodi_id: dosen ? String(dosen.prodi_id) : "",
        nidn: dosen?.nidn ?? "",
        nuptk: dosen?.nuptk ?? "",
        nama_dosen: dosen?.nama_dosen ?? "",
        jenis_kelamin: dosen?.jenis_kelamin ?? "",
        tempat_lahir: dosen?.tempat_lahir ?? "",
        tanggal_lahir: dosen?.tanggal_lahir ?? "",
        alamat: dosen?.alamat ?? "",
        hp: dosen?.hp ?? "",
        email: dosen?.email ?? "",
        foto: null as File | null,
        id_users: dosen ? String(dosen.user_id) : "",
        name: user?.name ?? "",
        password: user?.password ?? "",
        confirm_password: "",
    });

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("foto", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(dosen?.foto ?? null);
        }
    };

    const handleNamaDosenChange = (value: string) => {
        setData((prevData) => ({
            ...prevData,
            nama_dosen: value,
            name: getNamaDosenValue(value),
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route("admin.dosen.update", dosen!.id), {
                forceFormData: true,
                onSuccess: () => setData("foto", null),
            });
        } else {
            post(route("admin.dosen.store"), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };
    const [prodi, setProdi] = useState<Prodi[]>([]);
    const [prodiLoading, setProdiLoading] = useState(false);

    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [isDraggingFoto, setIsDraggingFoto] = useState(false);

    // Reset prodi whenever fakultas changes, then fetch the new list.
    useEffect(() => {
        if (!data.fakultas_id) {
            setProdi([]);
            return;
        }

        setProdiLoading(true);

        fetch(route("admin.prodi.getProdi", data.fakultas_id))
            .then((response) => response.json())
            .then((data: Prodi[]) => setProdi(data))
            .catch((error) => {
                console.error("Gagal mengambil data prodi", error);
                setProdi([]);
            })
            .finally(() => setProdiLoading(false));
    }, [data.fakultas_id]);

    const applyFotoFile = (file: File | null) => {
        if (!file) {
            setFotoPreview(null);
            return;
        }
        setFotoPreview(URL.createObjectURL(file));
        setData("foto", file);
    };

    return (
        <>
            <Head title="Tambah Dosen" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                            <UserRound className="text-primary size-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Tambah Dosen
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Tambahkan data dosen baru ke dalam sistem.
                            </p>
                        </div>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={route("admin.dosen.index")}
                                >
                                    Dosen
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Tambah Dosen</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto w-full max-w-5xl space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Fakultas & Prodi</CardTitle>
                            <CardDescription>
                                Pilih fakultas terlebih dahulu, lalu pilih
                                program studi dosen.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="fakultas_id">
                                        Fakultas
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Select
                                        name="fakultas_id"
                                        value={data.fakultas_id}
                                        onValueChange={(value) =>
                                            setData("fakultas_id", value)
                                        }
                                        disabled={fakultas.length === 0}
                                    >
                                        <SelectTrigger
                                            id="fakultas_id"
                                            aria-invalid={!!errors.fakultas_id}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    fakultas.length === 0
                                                        ? "Data fakultas belum ada"
                                                        : "Pilih salah satu fakultas"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fakultas.map((f) => (
                                                <SelectItem
                                                    key={f.id}
                                                    value={String(f.id)}
                                                >
                                                    {f.nama_fakultas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.fakultas_id ? (
                                        <p className="text-sm text-red-500">
                                            {errors.fakultas_id}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-xs">
                                            Belum ada fakultasnya? Tambahkan
                                            lebih dulu di halaman{" "}
                                            <Link
                                                href={route(
                                                    "admin.fakultas.index",
                                                )}
                                                className="underline underline-offset-2"
                                                viewTransition
                                            >
                                                Fakultas
                                            </Link>
                                            .
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="prodi_id">
                                        Prodi
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Select
                                        name="prodi_id"
                                        disabled={
                                            !data.fakultas_id ||
                                            prodiLoading ||
                                            prodi.length === 0
                                        }
                                        value={data.prodi_id}
                                        onValueChange={(value) =>
                                            setData("prodi_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="prodi_id"
                                            aria-invalid={!!errors.prodi_id}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    !data.fakultas_id
                                                        ? "Pilih fakultas terlebih dahulu"
                                                        : prodiLoading
                                                          ? "Memuat prodi..."
                                                          : prodi.length === 0
                                                            ? "Data prodi belum ada"
                                                            : "Pilih salah satu prodi"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prodi.map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={String(p.id)}
                                                >
                                                    {p.nama_prodi}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.prodi_id ? (
                                        <p className="text-sm text-red-500">
                                            {errors.prodi_id}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-xs">
                                            Pastikan data prodi sudah masuk di
                                            halaman{" "}
                                            <Link
                                                href={route(
                                                    "admin.prodi.index",
                                                )}
                                                className="underline underline-offset-2"
                                                viewTransition
                                            >
                                                Prodi
                                            </Link>
                                            .
                                        </p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Identitas Dosen */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserRound className="size-5" />
                                Identitas Dosen
                            </CardTitle>
                            <CardDescription>
                                Masukkan informasi identitas dan nomor
                                registrasi dosen.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                                {/* Foto Dosen — drag & drop */}
                                <Field>
                                    <FieldLabel htmlFor="foto">
                                        Foto Dosen
                                    </FieldLabel>

                                    <label
                                        htmlFor="foto"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingFoto(true);
                                        }}
                                        onDragLeave={() =>
                                            setIsDraggingFoto(false)
                                        }
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDraggingFoto(false);
                                            const file =
                                                e.dataTransfer.files?.[0] ??
                                                null;
                                            applyFotoFile(file);
                                        }}
                                        className={cn(
                                            "group relative flex aspect-square w-full max-w-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                                            isDraggingFoto
                                                ? "border-primary bg-primary/5"
                                                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                                        )}
                                    >
                                        {dosen?.foto ? (
                                            <>
                                                <img
                                                    src={dosen?.foto}
                                                    alt="Preview foto dosen"
                                                    className="h-full w-full object-cover"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {fotoPreview ? (
                                                    <>
                                                        <img
                                                            src={fotoPreview}
                                                            alt="Preview foto dosen"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                applyFotoFile(
                                                                    null,
                                                                );
                                                            }}
                                                            className="bg-background/90 hover:bg-background absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full shadow-sm"
                                                            aria-label="Hapus foto"
                                                        >
                                                            <X className="size-3.5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="text-muted-foreground flex flex-col items-center gap-2 p-4 text-center">
                                                        <ImageUp className="size-8" />
                                                        <span className="text-xs">
                                                            Klik atau seret foto
                                                            ke sini
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </label>

                                    <Input
                                        id="foto"
                                        name="foto"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="sr-only"
                                        aria-invalid={!!errors.foto}
                                        onChange={(e) =>
                                            applyFotoFile(
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />

                                    <p className="text-muted-foreground text-center text-xs">
                                        JPG, PNG, atau WebP · Maks. 2 MB
                                    </p>

                                    {errors.foto && (
                                        <p className="text-center text-sm text-red-500">
                                            {errors.foto}
                                        </p>
                                    )}
                                </Field>

                                {/* Data Identitas */}
                                <FieldGroup className="grid gap-5 md:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="nidn">
                                            NIDN
                                            <RequiredMark />
                                        </FieldLabel>

                                        <Input
                                            id="nidn"
                                            name="nidn"
                                            placeholder="Contoh: 0123456789"
                                            aria-invalid={!!errors.nidn}
                                            value={data.nidn}
                                            onChange={(e) =>
                                                setData("nidn", e.target.value)
                                            }
                                        />
                                        <p className="text-muted-foreground text-xs">
                                            Nomor Induk Dosen Nasional.
                                        </p>
                                        {errors.nidn && (
                                            <p className="text-sm text-red-500">
                                                {errors.nidn}
                                            </p>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="nuptk">
                                            NUPTK
                                            <span className="text-muted-foreground ml-1 text-xs font-normal">
                                                (opsional)
                                            </span>
                                        </FieldLabel>

                                        <Input
                                            id="nuptk"
                                            name="nuptk"
                                            placeholder="Contoh: 1234567890123456"
                                            aria-invalid={!!errors.nuptk}
                                            value={data.nuptk}
                                            onChange={(e) => {
                                                setData(
                                                    "nuptk",
                                                    e.target.value,
                                                );
                                            }}
                                        />
                                        <p className="text-muted-foreground text-xs">
                                            Nomor Unik Pendidik dan Tenaga
                                            Kependidikan.
                                        </p>
                                        {errors.nuptk && (
                                            <p className="text-sm text-red-500">
                                                {errors.nuptk}
                                            </p>
                                        )}
                                    </Field>

                                    <Field className="md:col-span-2">
                                        <FieldLabel htmlFor="nama_dosen">
                                            Nama Dosen
                                            <RequiredMark />
                                        </FieldLabel>

                                        <Input
                                            id="nama_dosen"
                                            name="nama_dosen"
                                            placeholder="Masukkan nama lengkap dosen"
                                            aria-invalid={!!errors.nama_dosen}
                                            value={data.nama_dosen}
                                            onChange={(e) =>
                                                handleNamaDosenChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.nama_dosen && (
                                            <p className="text-sm text-red-500">
                                                {errors.nama_dosen}
                                            </p>
                                        )}
                                    </Field>
                                </FieldGroup>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informasi Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Contact className="size-5" />
                                Informasi Pribadi
                            </CardTitle>
                            <CardDescription>
                                Masukkan informasi pribadi dosen.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="jenis_kelamin">
                                        Jenis Kelamin
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Select
                                        name="jenis_kelamin"
                                        onValueChange={(value) =>
                                            setData("jenis_kelamin", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="jenis_kelamin"
                                            aria-invalid={
                                                !!errors.jenis_kelamin
                                            }
                                        >
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">
                                                Laki-laki
                                            </SelectItem>
                                            <SelectItem value="P">
                                                Perempuan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && (
                                        <p className="text-sm text-red-500">
                                            {errors.jenis_kelamin}
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="tempat_lahir">
                                        Tempat Lahir
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Input
                                        id="tempat_lahir"
                                        name="tempat_lahir"
                                        placeholder="Contoh: Tangerang"
                                        onChange={(e) =>
                                            setData(
                                                "tempat_lahir",
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.tempat_lahir}
                                    />
                                    {errors.tempat_lahir && (
                                        <p className="text-sm text-red-500">
                                            {errors.tempat_lahir}
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="tanggal_lahir">
                                        Tanggal Lahir
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Input
                                        id="tanggal_lahir"
                                        name="tanggal_lahir"
                                        type="date"
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_lahir",
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.tanggal_lahir}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-red-500">
                                            {errors.tanggal_lahir}
                                        </p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Informasi Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Contact className="size-5" />
                                Informasi Kontak
                            </CardTitle>
                            <CardDescription>
                                Masukkan informasi kontak dan alamat dosen.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="hp">
                                        Nomor HP
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Input
                                        id="hp"
                                        name="hp"
                                        type="tel"
                                        placeholder="Contoh: 081234567890"
                                        aria-invalid={!!errors.hp}
                                        value={data.hp}
                                        onChange={(e) =>
                                            setData("hp", e.target.value)
                                        }
                                    />
                                    {errors.hp && (
                                        <p className="text-sm text-red-500">
                                            {errors.hp}
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Contoh: email_dosen@gmail.com"
                                        aria-invalid={!!errors.email}
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </Field>

                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="alamat">
                                        Alamat
                                        <RequiredMark />
                                    </FieldLabel>

                                    <Textarea
                                        id="alamat"
                                        name="alamat"
                                        placeholder="Masukkan alamat lengkap dosen"
                                        className="min-h-28 resize-none"
                                        aria-invalid={!!errors.alamat}
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-red-500">
                                            {errors.alamat}
                                        </p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="size-5" />
                                Informasi User
                            </CardTitle>
                            <CardDescription>
                                Buat akun untuk dosen agar bisa login
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-5 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Nama Akun
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        name="name"
                                        placeholder="Nama Akun"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData(
                                                "name",
                                                getNamaDosenValue(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm">
                                            {errors.name}
                                        </p>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email_akun">
                                        Email Akun
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        name="email_akun"
                                        type="email"
                                        placeholder="Contoh email@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        disabled
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Password
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm_password">
                                        Konfirmasi Password
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        name="confirm_password"
                                        type="password"
                                        onChange={(e) =>
                                            setData(
                                                "confirm_password",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Action bar — sticks to the bottom so it's always reachable on long forms */}
                    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:justify-end sm:rounded-lg sm:border">
                        <Link href={route("admin.dosen.index")} viewTransition>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                disabled={processing}
                            >
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                        </Link>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            {processing ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            {processing ? "Menyimpan..." : "Simpan Dosen"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
