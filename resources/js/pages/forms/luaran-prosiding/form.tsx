import axios from "axios";
import { useEffect } from "react";
import {
    ArrowLeft,
    BookText,
    FileText,
    Link2,
    Plus,
    Trash2,
    Users,
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
import { LuaranProsiding } from "@/interface/luaran-prosiding";
import { Field, FieldGroup } from "@/components/ui/field";
import { Combobox } from "@/components/ui/combobox";
import { Penulis } from "@/interface/penulis";
import SectionHeading from "@/components/section-heading";
import FormPenulis from "@/components/form-penulis";

interface Props {
    fakultas: Fakultas[];
    luaranProsiding?: LuaranProsiding;
    role?: string;
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormLuaranProsiding({
    fakultas,
    luaranProsiding,
    role,
}: Props) {
    const isEdit = !!luaranProsiding;
    const [semester, setSemester] = useState(luaranProsiding?.semester ?? "");

    const actionAdmin = isEdit
        ? route("admin.luaran_prosiding.update", luaranProsiding!.id)
        : route("admin.luaran_prosiding.store");

    const actionDosen = isEdit
        ? route("dosen.luaran_prosiding.update", luaranProsiding!.id)
        : route("dosen.luaran_prosiding.store");

    const actionUppm = isEdit
        ? route("uppm.luaran_prosiding.update", luaranProsiding!.id)
        : route("uppm.luaran_prosiding.store");

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
                        {/* Kolom kiri: Informasi Publikasi + Detail Prosiding */}
                        <div className="space-y-8 lg:col-span-2">
                            <div className="space-y-5">
                                <SectionHeading
                                    icon={BookText}
                                    title="Informasi Publikasi"
                                    description="Judul dan ringkasan singkat dari luaran prosiding."
                                />

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
                                                    luaranProsiding?.judul
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
                                        defaultValue={luaranProsiding?.abstrak}
                                        placeholder="Ringkasan singkat luaran prosiding"
                                        rows={6}
                                        className="text-base"
                                    />
                                    {errors.abstrak && (
                                        <p className="text-sm text-red-500">
                                            {errors.abstrak}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-5">
                                <SectionHeading
                                    icon={FileText}
                                    title="Detail Prosiding"
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
                                                luaranProsiding?.tahun
                                            }
                                            placeholder="2026"
                                            className="h-11 text-base"
                                        />
                                        {errors.tahun && (
                                            <p className="text-sm text-red-500">
                                                {errors.tahun}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 sm:pl-12">
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
                                            luaranProsiding?.link_berkas
                                        }
                                        placeholder="https://drive.google.com/..."
                                        className="h-11 text-base"
                                    />
                                    {errors.link_berkas && (
                                        <p className="text-sm text-red-500">
                                            {errors.link_berkas}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <FormPenulis
                            fakultas={fakultas}
                            data={luaranProsiding}
                            errors={errors}
                        />
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={
                                role === "dosen"
                                    ? route("dosen.luaran_prosiding.index")
                                    : role === "uppm"
                                      ? route("uppm.luaran_prosiding.index")
                                      : route("admin.luaran_prosiding.index")
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
                                : "Simpan Luaran Prosiding"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
