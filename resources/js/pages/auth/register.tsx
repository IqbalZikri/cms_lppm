import { Form, Head } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { route } from "ziggy-js";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas } from "@/interface/fakultas";
import { cn } from "@/lib/utils";
import { login } from "@/routes";

/* ------------------------------------------------------------------ */
/* Types & konfigurasi langkah                                         */
/* ------------------------------------------------------------------ */

// Sesuaikan dengan model Prodi Anda (atau pindahkan ke @/interface/prodi)
type Prodi = {
    id: number;
    fakultas_id: number;
    nama_prodi: string;
};

type Props = {
    passwordRules: string;
    fakultas: Fakultas[];
    prodi?: Prodi[];
};

const STEPS = [
    { title: "Data Diri", hint: "Nama dan tanggal lahir Anda" },
    { title: "Data Kampus", hint: "Fakultas, program studi, dan NIDN" },
    { title: "Kontak", hint: "Nomor HP dan alamat tempat tinggal" },
    { title: "Akun", hint: "Email dan kata sandi untuk masuk" },
];

// Semua field per langkah (dipakai untuk melompat ke langkah yang error dari server)
const STEP_FIELDS: string[][] = [
    ["name", "jenis_kelamin", "tempat_lahir", "tanggal_lahir"],
    ["fakultas_id", "prodi_id", "nidn", "nuptk"],
    ["hp", "alamat"],
    ["email", "password", "password_confirmation"],
];

// Field wajib per langkah (fakultas & prodi dicek terpisah di validateStep)
const REQUIRED_FIELDS: string[][] = [
    ["name", "jenis_kelamin", "tempat_lahir", "tanggal_lahir"],
    [],
    ["hp", "alamat"],
    ["email", "password", "password_confirmation"],
];

/* ------------------------------------------------------------------ */
/* Gaya dasar: semua dibuat lebih besar agar nyaman dibaca             */
/* ------------------------------------------------------------------ */

const labelCls = "text-base font-medium";
const inputCls = "h-12 text-base md:text-base";
const selectCls = "h-12 w-full text-base data-[size=default]:h-12";
const errorCls = "text-base";

const Req = () => (
    <span className="text-destructive" aria-hidden="true">
        *
    </span>
);

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function Register({
    passwordRules,
    fakultas,
    prodi = [],
}: Props) {
    return (
        <>
            <Head title="Buat Akun" />
            <Form
                action={route("sesi.registerAccount")}
                resetOnSuccess={["password", "password_confirmation"]}
                disableWhileProcessing
                noValidate
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <RegisterSteps
                        processing={processing}
                        errors={errors}
                        fakultas={fakultas}
                        prodi={prodi}
                        passwordRules={passwordRules}
                    />
                )}
            </Form>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Isi form (dipisah agar bisa memakai hooks di dalam render-prop Form) */
/* ------------------------------------------------------------------ */

type StepsProps = {
    processing: boolean;
    errors: Record<string, string>;
    fakultas: Fakultas[];
    prodi: Prodi[];
    passwordRules: string;
};

function RegisterSteps({
    processing,
    errors,
    fakultas,
    prodi,
    passwordRules,
}: StepsProps) {
    const [step, setStep] = useState(0);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {},
    );
    const [gender, setGender] = useState("");
    const [fakultasId, setFakultasId] = useState("");
    const [prodiId, setProdiId] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);

    const prodiOptions = prodi.filter(
        (p) => String(p.fakultas_id) === fakultasId,
    );
    const isLast = step === STEPS.length - 1;

    // Pesan error: validasi di browser dulu, baru error dari server
    const err = (name: string) => clientErrors[name] ?? errors[name];

    const clearError = (name: string) => {
        if (!name) return;
        setClientErrors((prev) => {
            if (!(name in prev)) return prev;
            const { [name]: _removed, ...rest } = prev;
            return rest;
        });
    };

    // Jika server menolak isian, otomatis pindah ke langkah pertama yang bermasalah
    useEffect(() => {
        const keys = Object.keys(errors);
        if (keys.length === 0) return;
        const first = STEP_FIELDS.findIndex((fields) =>
            fields.some((k) => keys.includes(k)),
        );
        if (first !== -1) setStep(first);
    }, [errors]);

    // Ambil nilai field: yang dikontrol lewat state, sisanya dari FormData
    const getValue = (name: string): string => {
        if (name === "jenis_kelamin") return gender;
        if (name === "fakultas_id") return fakultasId;
        if (name === "prodi_id") return prodiId;
        const form = rootRef.current?.closest("form");
        if (!form) return "";
        return String(new FormData(form).get(name) ?? "");
    };

    const validateStep = (index: number): boolean => {
        const found: Record<string, string> = {};
        const required = [...REQUIRED_FIELDS[index]];

        if (index === 1) {
            if (fakultas.length > 0) required.push("fakultas_id");
            if (prodiOptions.length > 0) required.push("prodi_id");
        }

        for (const name of required) {
            if (getValue(name).trim() === "") {
                found[name] =
                    name === "fakultas_id" ||
                    name === "prodi_id" ||
                    name === "jenis_kelamin"
                        ? "Silakan pilih salah satu."
                        : "Bagian ini wajib diisi.";
            }
        }

        if (index === 3) {
            const email = getValue("email").trim();
            if (email && !/^\S+@\S+\.\S+$/.test(email)) {
                found.email =
                    "Alamat email belum benar. Contoh: nama@gmail.com";
            }
            const pw = getValue("password");
            const confirm = getValue("password_confirmation");
            if (pw && confirm && pw !== confirm) {
                found.password_confirmation =
                    "Kata sandi yang diketik ulang belum sama.";
            }
        }

        setClientErrors((prev) => {
            const next = { ...prev };
            STEP_FIELDS[index].forEach((k) => delete next[k]);
            return { ...next, ...found };
        });

        return Object.keys(found).length === 0;
    };

    const scrollToTop = () =>
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const next = () => {
        if (!validateStep(step)) return;
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
        scrollToTop();
    };

    const back = () => {
        setStep((s) => Math.max(s - 1, 0));
        scrollToTop();
    };

    // Tekan Enter di langkah 1-3 = lanjut (bukan mengirim form secara tidak sengaja)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (
            e.key === "Enter" &&
            !isLast &&
            target.tagName === "INPUT"
        ) {
            e.preventDefault();
            next();
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div
            ref={rootRef}
            className="flex scroll-mt-6 flex-col gap-8"
            onChange={(e) =>
                clearError((e.target as HTMLInputElement).name)
            }
            onKeyDown={handleKeyDown}
        >
            {/* ---------- Indikator langkah ---------- */}
            <div className="flex flex-col gap-4">
                <nav aria-label="Langkah pendaftaran">
                    <ol className="flex items-center">
                        {STEPS.map((s, i) => {
                            const done = i < step;
                            const current = i === step;
                            return (
                                <li
                                    key={s.title}
                                    className="flex flex-1 items-center last:flex-none"
                                >
                                    <span
                                        aria-current={
                                            current ? "step" : undefined
                                        }
                                        aria-label={`Langkah ${i + 1}: ${s.title}${
                                            done ? " (selesai)" : ""
                                        }`}
                                        className={cn(
                                            "flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-lg font-semibold",
                                            done &&
                                                "border-primary bg-primary text-primary-foreground",
                                            current &&
                                                "border-primary text-primary",
                                            !done &&
                                                !current &&
                                                "border-border text-muted-foreground",
                                        )}
                                    >
                                        {done ? (
                                            <Check className="size-5" />
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    {i < STEPS.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "mx-2 h-1 flex-1 rounded-full",
                                                done
                                                    ? "bg-primary"
                                                    : "bg-border",
                                            )}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <div className="text-center">
                    <p className="text-muted-foreground text-base">
                        Langkah {step + 1} dari {STEPS.length}
                    </p>
                    <h2 className="text-2xl font-semibold">
                        {STEPS[step].title}
                    </h2>
                    <p className="text-muted-foreground text-base">
                        {STEPS[step].hint}
                    </p>
                </div>
            </div>

            {/* ---------- Ringkasan error dari server ---------- */}
            {hasErrors && (
                <div
                    role="alert"
                    className="border-destructive/40 bg-destructive/5 text-destructive rounded-md border-2 p-4 text-base"
                >
                    Pendaftaran belum berhasil. Mohon periksa isian yang
                    bertanda merah di bawah ini, lalu coba lagi.
                </div>
            )}

            <p className="text-muted-foreground -mb-4 text-base">
                Isian bertanda <span className="text-destructive">*</span>{" "}
                wajib diisi.
            </p>

            {/* ---------- Langkah 1: Data diri ---------- */}
            {/* Semua langkah tetap ada di halaman (hanya disembunyikan) agar semua isian ikut terkirim */}
            <div hidden={step !== 0}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name" className={labelCls}>
                            Nama lengkap <Req />
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            autoFocus
                            placeholder="Contoh: Dr. Budi Santoso, M.Kom."
                            className={inputCls}
                            aria-invalid={!!err("name")}
                        />
                        <FieldDescription className="text-base">
                            Tulis lengkap beserta gelar.
                        </FieldDescription>
                        <InputError
                            message={err("name")}
                            className={errorCls}
                        />
                    </Field>

                    <Field>
                        <Label className={labelCls} id="jenis_kelamin_label">
                            Jenis kelamin <Req />
                        </Label>
                        <RadioGroup
                            name="jenis_kelamin"
                            value={gender}
                            onValueChange={(v) => {
                                setGender(v);
                                clearError("jenis_kelamin");
                            }}
                            aria-labelledby="jenis_kelamin_label"
                            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                        >
                            {[
                                { value: "L", label: "Laki-laki" },
                                { value: "P", label: "Perempuan" },
                            ].map((o) => (
                                <Label
                                    key={o.value}
                                    htmlFor={`jk-${o.value}`}
                                    className={cn(
                                        "flex h-12 cursor-pointer items-center gap-3 rounded-md border-2 px-4 text-base font-normal",
                                        gender === o.value
                                            ? "border-primary bg-primary/5 font-medium"
                                            : "border-input",
                                        err("jenis_kelamin") &&
                                            "border-destructive",
                                    )}
                                >
                                    <RadioGroupItem
                                        value={o.value}
                                        id={`jk-${o.value}`}
                                        className="size-5"
                                    />
                                    {o.label}
                                </Label>
                            ))}
                        </RadioGroup>
                        <InputError
                            message={err("jenis_kelamin")}
                            className={errorCls}
                        />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field>
                            <Label htmlFor="tempat_lahir" className={labelCls}>
                                Tempat lahir <Req />
                            </Label>
                            <Input
                                id="tempat_lahir"
                                name="tempat_lahir"
                                type="text"
                                placeholder="Contoh: Bandung"
                                className={inputCls}
                                aria-invalid={!!err("tempat_lahir")}
                            />
                            <InputError
                                message={err("tempat_lahir")}
                                className={errorCls}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="tanggal_lahir" className={labelCls}>
                                Tanggal lahir <Req />
                            </Label>
                            <Input
                                id="tanggal_lahir"
                                name="tanggal_lahir"
                                type="date"
                                className={inputCls}
                                aria-invalid={!!err("tanggal_lahir")}
                            />
                            <InputError
                                message={err("tanggal_lahir")}
                                className={errorCls}
                            />
                        </Field>
                    </div>
                </FieldGroup>
            </div>

            {/* ---------- Langkah 2: Data kampus ---------- */}
            <div hidden={step !== 1}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="fakultas_id" className={labelCls}>
                            Fakultas {fakultas.length > 0 && <Req />}
                        </Label>
                        <Select
                            name="fakultas_id"
                            value={fakultasId}
                            onValueChange={(v) => {
                                setFakultasId(v);
                                setProdiId("");
                                clearError("fakultas_id");
                                clearError("prodi_id");
                            }}
                            disabled={fakultas.length === 0}
                        >
                            <SelectTrigger
                                id="fakultas_id"
                                className={selectCls}
                                aria-invalid={!!err("fakultas_id")}
                            >
                                <SelectValue
                                    placeholder={
                                        fakultas.length === 0
                                            ? "Data fakultas belum tersedia"
                                            : "Pilih fakultas Anda"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {fakultas.map((f) => (
                                    <SelectItem
                                        key={f.id}
                                        value={String(f.id)}
                                        className="py-3 text-base"
                                    >
                                        {f.nama_fakultas}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError
                            message={err("fakultas_id")}
                            className={errorCls}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="prodi_id" className={labelCls}>
                            Program studi {prodiOptions.length > 0 && <Req />}
                        </Label>
                        <Select
                            name="prodi_id"
                            value={prodiId}
                            onValueChange={(v) => {
                                setProdiId(v);
                                clearError("prodi_id");
                            }}
                            disabled={prodiOptions.length === 0}
                        >
                            <SelectTrigger
                                id="prodi_id"
                                className={selectCls}
                                aria-invalid={!!err("prodi_id")}
                            >
                                <SelectValue
                                    placeholder={
                                        !fakultasId
                                            ? "Pilih fakultas terlebih dahulu"
                                            : prodiOptions.length === 0
                                              ? "Belum ada program studi"
                                              : "Pilih program studi Anda"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {prodiOptions.map((p) => (
                                    <SelectItem
                                        key={p.id}
                                        value={String(p.id)}
                                        className="py-3 text-base"
                                    >
                                        {p.nama_prodi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError
                            message={err("prodi_id")}
                            className={errorCls}
                        />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field>
                            <Label htmlFor="nidn" className={labelCls}>
                                NIDN
                            </Label>
                            <Input
                                id="nidn"
                                name="nidn"
                                type="text"
                                inputMode="numeric"
                                placeholder="Nomor NIDN"
                                className={inputCls}
                                aria-invalid={!!err("nidn")}
                            />
                            <InputError
                                message={err("nidn")}
                                className={errorCls}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="nuptk" className={labelCls}>
                                NUPTK
                            </Label>
                            <Input
                                id="nuptk"
                                name="nuptk"
                                type="text"
                                inputMode="numeric"
                                placeholder="Nomor NUPTK"
                                className={inputCls}
                                aria-invalid={!!err("nuptk")}
                            />
                            <InputError
                                message={err("nuptk")}
                                className={errorCls}
                            />
                        </Field>
                    </div>
                    <FieldDescription className="-mt-3 text-base">
                        NIDN dan NUPTK boleh dikosongkan jika Anda belum
                        memilikinya.
                    </FieldDescription>
                </FieldGroup>
            </div>

            {/* ---------- Langkah 3: Kontak ---------- */}
            <div hidden={step !== 2}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="hp" className={labelCls}>
                            Nomor HP / WhatsApp <Req />
                        </Label>
                        <Input
                            id="hp"
                            name="hp"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="Contoh: 081234567890"
                            className={inputCls}
                            aria-invalid={!!err("hp")}
                        />
                        <FieldDescription className="text-base">
                            Gunakan nomor yang aktif dan bisa dihubungi.
                        </FieldDescription>
                        <InputError message={err("hp")} className={errorCls} />
                    </Field>

                    <Field>
                        <Label htmlFor="alamat" className={labelCls}>
                            Alamat tempat tinggal <Req />
                        </Label>
                        <Textarea
                            id="alamat"
                            name="alamat"
                            rows={4}
                            autoComplete="street-address"
                            placeholder="Nama jalan, nomor rumah, kelurahan, kota"
                            className="min-h-28 text-base md:text-base"
                            aria-invalid={!!err("alamat")}
                        />
                        <InputError
                            message={err("alamat")}
                            className={errorCls}
                        />
                    </Field>
                </FieldGroup>
            </div>

            {/* ---------- Langkah 4: Akun ---------- */}
            <div hidden={step !== 3}>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="email" className={labelCls}>
                            Alamat email <Req />
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Contoh: nama@gmail.com"
                            className={inputCls}
                            aria-invalid={!!err("email")}
                        />
                        <FieldDescription className="text-base">
                            Email ini dipakai untuk masuk ke aplikasi.
                        </FieldDescription>
                        <InputError
                            message={err("email")}
                            className={errorCls}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="password" className={labelCls}>
                            Kata sandi <Req />
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="Buat kata sandi"
                            passwordrules={passwordRules}
                            className={inputCls}
                        />
                        <FieldDescription className="text-base">
                            Klik ikon mata untuk melihat apa yang Anda ketik.
                        </FieldDescription>
                        <InputError
                            message={err("password")}
                            className={errorCls}
                        />
                    </Field>

                    <Field>
                        <Label
                            htmlFor="password_confirmation"
                            className={labelCls}
                        >
                            Ketik ulang kata sandi <Req />
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            autoComplete="new-password"
                            placeholder="Ketik kata sandi yang sama"
                            passwordrules={passwordRules}
                            className={inputCls}
                        />
                        <InputError
                            message={err("password_confirmation")}
                            className={errorCls}
                        />
                    </Field>
                </FieldGroup>
            </div>

            {/* ---------- Tombol navigasi ---------- */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {step > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={back}
                        className="h-12 text-base sm:w-40"
                    >
                        <ArrowLeft className="size-5" />
                        Kembali
                    </Button>
                )}

                {/* key wajib: mencegah React memakai ulang tombol yang sama
                    (tombol "Lanjut" tidak boleh berubah jadi submit di tengah klik) */}
                {isLast ? (
                    <Button
                        key="submit"
                        type="submit"
                        className="h-12 flex-1 text-base"
                        data-test="register-user-button"
                        onClick={(e) => {
                            if (!validateStep(step)) e.preventDefault();
                        }}
                    >
                        {processing && <Spinner />}
                        Buat Akun
                    </Button>
                ) : (
                    <Button
                        key="next"
                        type="button"
                        onClick={next}
                        className="h-12 flex-1 text-base"
                    >
                        Lanjut
                        <ArrowRight className="size-5" />
                    </Button>
                )}
            </div>

            <div className="text-muted-foreground text-center text-base">
                Sudah punya akun?{" "}
                <TextLink href={login()} className="font-medium">
                    Masuk di sini
                </TextLink>
            </div>
        </div>
    );
}

Register.layout = {
    title: "Buat Akun Dosen",
    description:
        "Isi data Anda langkah demi langkah untuk membuat akun Lembaga Penelitian dan Pengabdian Masyarakat.",
    maxWidth: "max-w-2xl", // dipakai jika layout auth Anda sudah menerima prop maxWidth
};