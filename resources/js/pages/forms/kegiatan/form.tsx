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
import { Kegiatan } from "@/interface/kegiatan";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { formatRupiah } from "../pkm/form";
import { Combobox } from "@/components/ui/combobox";
import SectionHeading from "@/components/section-heading";
import FormPenulis from "@/components/form-penulis";

interface Props {
    fakultas: Fakultas[];
    kegiatan?: Kegiatan;
    role?: string;
    action?: string;
}

function RequiredMark() {
    return <span className="ml-0.5 text-red-500">*</span>;
}

export default function FormKegiatan({
    fakultas,
    kegiatan,
    role,
    action,
}: Props) {
    const isEdit = !!kegiatan;
    const [semester, setSemester] = useState(kegiatan?.semester ?? "");
    const [sumberDana, setSumberDana] = useState(kegiatan?.sumber_dana ?? "");
    const [jumlahDana, setJumlahDana] = useState(
        kegiatan?.jumlah_dana ? String(kegiatan?.jumlah_dana) : "",
    );

    const actionAdmin = isEdit
        ? route("admin.kegiatan.update", kegiatan!.id)
        : route("admin.kegiatan.store");

    const actionDosen = isEdit
        ? route("dosen.kegiatan.update", kegiatan!.id)
        : route("dosen.kegiatan.store");

    const actionUppm = isEdit
        ? route("uppm.kegiatan.update", kegiatan!.id)
        : route("uppm.kegiatan.store");

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
                        {/* Kolom kiri: Informasi Publikasi + Detail kegiatan */}
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
                                                htmlFor="judul"
                                                className="text-base"
                                            >
                                                Judul
                                                <RequiredMark />
                                            </Label>
                                            <Input
                                                id="judul"
                                                name="judul"
                                                defaultValue={kegiatan?.judul}
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
                                                defaultValue={kegiatan?.abstrak}
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
                                    title="Detail kegiatan"
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
                                                        kegiatan?.tahun
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
                                                    kegiatan?.link_berkas
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
                        </div>

                        <FormPenulis fakultas={fakultas} data={kegiatan} errors={errors}/>
                       
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={
                                role === "dosen"
                                    ? route("dosen.kegiatan.index")
                                    : role === "uppm"
                                      ? route("uppm.kegiatan.index")
                                      : route("admin.kegiatan.index")
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
                            {isEdit ? "Simpan Perubahan" : "Simpan kegiatan"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}
