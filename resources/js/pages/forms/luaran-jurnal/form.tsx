import axios from "axios";
import { useEffect } from "react";
import {
    ArrowLeft,
    BookText,
    FileText,
    Hash,
    Link2,
    Plus,
    Trash2,
    Users,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Dosen } from "@/types/dosen";
import { Form, Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Penulis } from "@/interface/penulis";
import { Field, FieldGroup } from "@/components/ui/field";
import { LuaranJurnal } from "@/interface/luaran-jurnal";
import { Combobox } from "@/components/ui/combobox";
import SectionHeading from "@/components/section-heading";
import FormPenulis from "@/components/form-penulis";

interface Props {
    fakultas: Fakultas[];
    luaranJurnal?: LuaranJurnal;
    role?: string;
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormLuaranJurnal({
    fakultas,
    luaranJurnal,
    role,
}: Props) {
    const isEdit = !!luaranJurnal;
    const [jenisluaranJurnal, setJenisluaranJurnal] = useState(
        luaranJurnal?.jenis_luaran_jurnal ?? "",
    );
    const [semester, setSemester] = useState(luaranJurnal?.semester ?? "");

    const actionAdmin = isEdit
        ? route("admin.luaran_jurnal.update", luaranJurnal!.id)
        : route("admin.luaran_jurnal.store");

    const actionDosen = isEdit
        ? route("dosen.luaran_jurnal.update", luaranJurnal!.id)
        : route("dosen.luaran_jurnal.store");

    const actionUppm = isEdit
        ? route("uppm.luaran_jurnal.update", luaranJurnal!.id)
        : route("uppm.luaran_jurnal.store");

    return (
        <Form
            action={
                role === "dosen"
                    ? actionDosen
                    : role === "uppm"
                      ? actionUppm
                      : actionAdmin
            }
            method={isEdit ? "put" : "post"}
        >
            {({ errors, processing }) => (
                <Card className="w-full shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 lg:gap-10">
                        {/* Kolom kiri: Informasi Publikasi + Detail luaranJurnal */}
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
                                                htmlFor="jenis_luaran_jurnal"
                                                className="text-base"
                                            >
                                                Jenis Luaran Jurnal
                                                <RequiredMark />
                                            </Label>
                                            <Select
                                                name="jenis_luaran_jurnal"
                                                value={jenisluaranJurnal}
                                                onValueChange={
                                                    setJenisluaranJurnal
                                                }
                                            >
                                                <SelectTrigger
                                                    id="jenis_luaran_jurnal"
                                                    className="h-11 text-base"
                                                    aria-invalid={
                                                        !!errors.jenis_luaran_jurnal
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih jenis Luaran Jurnal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="scopus q1">
                                                        Scopus Q1
                                                    </SelectItem>
                                                    <SelectItem value="scopus q2">
                                                        Scopus Q2
                                                    </SelectItem>
                                                    <SelectItem value="scopus q3">
                                                        Scopus Q3
                                                    </SelectItem>
                                                    <SelectItem value="sinta 1">
                                                        Sinta 1
                                                    </SelectItem>
                                                    <SelectItem value="sinta 2">
                                                        Sinta 2
                                                    </SelectItem>
                                                    <SelectItem value="sinta 3">
                                                        Sinta 3
                                                    </SelectItem>
                                                    <SelectItem value="sinta 4">
                                                        Sinta 4
                                                    </SelectItem>
                                                    <SelectItem value="sinta 5">
                                                        Sinta 5
                                                    </SelectItem>
                                                    <SelectItem value="non sinta">
                                                        Non Sinta
                                                    </SelectItem>
                                                    <SelectItem value="non scopus">
                                                        Non Scopus
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_luaran_jurnal && (
                                                <p className="text-sm text-red-500">
                                                    {errors.jenis_luaran_jurnal}
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
                                                defaultValue={
                                                    luaranJurnal?.judul
                                                }
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
                                                defaultValue={
                                                    luaranJurnal?.abstrak
                                                }
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
                                    title="Detail Luaran Jurnal"
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
                                                    defaultValue={
                                                        luaranJurnal?.tahun
                                                    }
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
                                                defaultValue={
                                                    luaranJurnal?.link_berkas
                                                }
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
                        </div>

                       <FormPenulis fakultas={fakultas} data={luaranJurnal} errors={errors}/>
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={
                                role === "dosen"
                                    ? route("dosen.luaran_jurnal.index")
                                    : role === "uppm"
                                      ? route("uppm.luaran_jurnal.index")
                                      : route("admin.luaran_jurnal.index")
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
                            disabled={processing}
                            className="h-11 w-full px-6 text-base sm:w-auto"
                        >
                            {isEdit
                                ? "Simpan Perubahan"
                                : "Simpan Luaran Jurnal"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
