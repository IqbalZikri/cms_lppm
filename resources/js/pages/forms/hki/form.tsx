import { useRef } from "react";
import {
    ArrowLeft,
    BookText,
    FileText,
    Hash,
    Link2,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas } from "@/interface/fakultas";
import { Form, Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Hki } from "@/interface/hki";
import { Field, FieldGroup } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { formatRupiah } from "@/pages/forms/pkm/form";
import FormPenulis from "@/components/form-penulis";
import SectionHeading from "@/components/section-heading";
import { User } from "@/types";

interface Props {
    fakultas: Fakultas[];
    hki?: Hki;
    user: User;
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormHki({ fakultas, hki, user }: Props) {
    const isEdit = !!hki;
    const [jenisHki, setJenisHki] = useState(hki?.jenis_hki ?? "");
    const [semester, setSemester] = useState(hki?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(hki?.sumber_dana ?? "");
    const [jumlahDana, setJumlahDana] = useState(
        hki?.jumlah_dana ? String(hki?.jumlah_dana) : "",
    );

    const actionAdmin = isEdit
        ? route("admin.hki.update", hki!.id)
        : route("admin.hki.store");

    const actionDosen = isEdit
        ? route("dosen.hki.update", hki!.id)
        : route("dosen.hki.store");

    const actionUppm = isEdit
        ? route("uppm.hki.update", hki!.id)
        : route("uppm.hki.store");

    const actionRef = useRef<HTMLInputElement>(null);
    return (
        <Form
            action={
                user.role === "dosen"
                    ? actionDosen
                    : user.role === "uppm"
                      ? actionUppm
                      : actionAdmin
            }
            method={isEdit ? "put" : "post"}
        >
            {({ errors, processing }) => (
                <Card className="w-full shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 lg:gap-10">
                        {/* Kolom kiri: Informasi Publikasi + Detail HKI */}
                        <div className="space-y-8 lg:col-span-2">
                            <div className="space-y-5">
                                <SectionHeading
                                    icon={BookText}
                                    title="Informasi Publikasi"
                                    description="Judul dan ringkasan singkat dari hak kekayaan intelektual."
                                />

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="jenis_hki"
                                                className="text-base"
                                            >
                                                Jenis HKI
                                                <RequiredMark />
                                            </Label>
                                            <Select
                                                name="jenis_hki"
                                                value={jenisHki}
                                                onValueChange={setJenisHki}
                                            >
                                                <SelectTrigger
                                                    id="jenis_hki"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.jenis_hki
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih jenis HKI" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="paten">
                                                        Paten
                                                    </SelectItem>
                                                    <SelectItem value="haki">
                                                        HAKI
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_hki && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jenis_hki}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="judul"
                                                className="text-base"
                                            >
                                                Judul
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="judul"
                                                name="judul"
                                                defaultValue={hki?.judul}
                                                placeholder="Contoh: Analisis Implementasi..."
                                                className="h-11 text-base"
                                                aria-invalid={!!errors.judul}
                                            />
                                            {errors.judul && (
                                                <p className="text-sm text-red-500">
                                                    {errors.judul}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="abstrak"
                                                className="text-base"
                                            >
                                                Abstrak
                                                <RequiredMark />
                                            </Label>
                                            <Textarea
                                                id="abstrak"
                                                name="abstrak"
                                                defaultValue={hki?.abstrak}
                                                placeholder="Ringkasan singkat hak kekayaan intelektual"
                                                rows={6}
                                                className="text-base"
                                                aria-invalid={!!errors.abstrak}
                                            />
                                            {errors.abstrak && (
                                                <p className="text-sm text-red-500">
                                                    {errors.abstrak}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={FileText}
                                    title="Detail HKI"
                                    description="Waktu terbit dan berkas pendukung."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="semester"
                                                    className="text-base"
                                                >
                                                    Semester
                                                    <RequiredMark />
                                                </Label>
                                                <Select
                                                    value={semester}
                                                    onValueChange={setSemester}
                                                >
                                                    <SelectTrigger
                                                        id="semester"
                                                        className="h-11 text-base"
                                                        aria-invalid={
                                                            !!errors.semester
                                                        }
                                                    >
                                                        <SelectValue placeholder="Pilih semester" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Ganjil">
                                                            Ganjil
                                                        </SelectItem>
                                                        <SelectItem value="Genap">
                                                            Genap
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="hidden"
                                                    name="semester"
                                                    value={semester}
                                                />
                                                {errors.semester && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.semester}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="tahun"
                                                    className="text-base"
                                                >
                                                    Tahun
                                                    <RequiredMark />
                                                </Label>
                                                <Input
                                                    id="tahun"
                                                    name="tahun"
                                                    type="number"
                                                    defaultValue={hki?.tahun}
                                                    placeholder="2026"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.tahun
                                                    }
                                                />
                                                {errors.tahun && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.tahun}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:pl-12">
                                    <FieldGroup>
                                        <Field>
                                            <Label
                                                htmlFor="link_berkas"
                                                className="text-base"
                                            >
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Link2 className="h-3.5 w-3.5" />
                                                    Link Berkas
                                                </span>
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="link_berkas"
                                                name="link_berkas"
                                                type="url"
                                                defaultValue={hki?.link_berkas}
                                                placeholder="https://drive.google.com/..."
                                                className="h-11 text-base"
                                                aria-invalid={
                                                    !!errors.link_berkas
                                                }
                                            />
                                            {errors.link_berkas && (
                                                <p className="text-sm text-red-500">
                                                    {errors.link_berkas}
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={Wallet}
                                    title="Dana"
                                    description="Jumlah dan sumber dana."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="jumlah_dana"
                                                    className="text-base"
                                                >
                                                    Jumlah Dana
                                                    <RequiredMark />
                                                </Label>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="jumlah_dana"
                                                        inputMode="numeric"
                                                        placeholder="Jumlah Dana"
                                                        value={
                                                            jumlahDana
                                                                ? formatRupiah(
                                                                      Number(
                                                                          jumlahDana,
                                                                      ),
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setJumlahDana(
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    "",
                                                                ),
                                                            )
                                                        }
                                                        aria-invalid={
                                                            !!errors.jumlah_dana
                                                        }
                                                    />
                                                    <InputGroupAddon>
                                                        Rp.
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <input
                                                    type="hidden"
                                                    name="jumlah_dana"
                                                    value={jumlahDana}
                                                />
                                                {errors.jumlah_dana && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.jumlah_dana}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="sumber_dana"
                                                    className="text-base"
                                                >
                                                    Sumber Dana
                                                    <RequiredMark />
                                                </Label>
                                                <Select
                                                    name="sumber_dana"
                                                    value={sumberDana}
                                                    onValueChange={
                                                        setSumberDana
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="sumber_dana"
                                                        className="h-11 text-base"
                                                        aria-invalid={
                                                            !!errors.sumber_dana
                                                        }
                                                    >
                                                        <SelectValue placeholder="Pilih Sumber Dana" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="internal">
                                                            Internal
                                                        </SelectItem>
                                                        <SelectItem value="eksternal">
                                                            Eksternal
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.sumber_dana && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.sumber_dana}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={Hash}
                                    title="Nomor Pengajuan HAKI atau Nomor Paten"
                                    description="Nomor resmi pengajuan HAKI atau paten."
                                />

                                <div className="grid grid-cols-1 gap-6 sm:pl-12 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="sumber_dana"
                                                    className="text-base"
                                                >
                                                    Nomor Paten
                                                    {jenisHki === "paten" ? (
                                                        <RequiredMark />
                                                    ) : (
                                                        ""
                                                    )}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    name="nomer_paten"
                                                    id="nomer_paten"
                                                    placeholder="Nomor Paten"
                                                    disabled={
                                                        jenisHki === "haki" ||
                                                        !jenisHki
                                                    }
                                                    aria-invalid={
                                                        !!errors.nomer_paten
                                                    }
                                                    value={hki?.nomer_paten}
                                                />
                                                {errors.nomer_paten && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.nomer_paten}
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldGroup>
                                            <Field>
                                                <Label
                                                    htmlFor="nomer_pengajuan_haki"
                                                    className="text-base"
                                                >
                                                    Nomor Pengajuan HAKI
                                                    {jenisHki === "haki" ? (
                                                        <RequiredMark />
                                                    ) : (
                                                        ""
                                                    )}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    name="nomer_pengajuan_haki"
                                                    id="nomer_pengajuan_haki"
                                                    placeholder="Nomor Pengajuan HAKI"
                                                    disabled={
                                                        jenisHki === "paten" ||
                                                        !jenisHki
                                                    }
                                                    aria-invalid={
                                                        !!errors.nomer_pengajuan_haki
                                                    }
                                                    value={
                                                        hki?.nomer_pengajuan_haki
                                                    }
                                                />
                                                {errors.nomer_pengajuan_haki && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.nomer_pengajuan_haki
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <FormPenulis
                            fakultas={fakultas}
                            data={hki}
                            errors={errors}
                        />
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <input
                            ref={actionRef}
                            type="hidden"
                            name="action"
                            defaultValue="submit"
                        />

                        <Link
                            href={
                                user.role === "dosen"
                                    ? route("dosen.hki.index")
                                    : user.role === "uppm"
                                      ? route("uppm.hki.index")
                                      : route("admin.hki.index")
                            }
                            viewTransition
                            className="w-full sm:w-auto"
                        >
                            <Button
                                className="h-11 w-full px-6 text-base sm:w-auto"
                                variant="outline"
                            >
                                <ArrowLeft />
                                Kembali
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={processing}
                            onClick={() => {
                                if (actionRef.current)
                                    actionRef.current.value = "draft";
                            }}
                        >
                            Simpan Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 w-full px-6 text-base sm:w-auto"
                        >
                            {isEdit ? "Simpan Perubahan" : user.role === "admin" ? "Simpan HKI" : "Ajukan"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
