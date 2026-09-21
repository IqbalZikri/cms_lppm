import { Head, useForm } from "@inertiajs/react";
import { FlaskConical } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
    ChoiceCards,
    CurrencyInput,
    Field,
    FormSection,
    PageHeader,
    SelectField,
    SubmitBar,
    SuccessBanner,
    TextArea,
    TextInput,
} from "@/components/lppm/form-parts";
import {
    PageTabs,
    SubmissionHistory,
} from "@/components/lppm/submission-history";
import DosenLayout from "@/layouts/dosen/dosen-layout";
import {
    ROUTES,
    SEMESTER_OPTIONS,
    SUMBER_DANA_OPTIONS,
    confirmReset,
    focusFirstError,
    tahunOptions,
    tahunSekarang,
    validateRequired,
} from "@/lib/lppm";
import type {
    DosenInfo,
    Fakultas,
    RiwayatItem,
    Semester,
    SumberDana,
} from "@/types/lppm";

type Props = {
    fakultas: Fakultas[];
    dosen?: DosenInfo;
    riwayat: RiwayatItem[];
};

type PenelitianForm = {
    fakultas_id: string;
    semester: Semester | "";
    tahun: string;
    jumlah_dana: string; // angka saja, contoh "15000000"
    sumber_dana: SumberDana | "";
    judul: string;
    abstrak: string;
};

export default function Penelitian({ fakultas, dosen, riwayat }: Props) {
    const [tab, setTab] = useState<"ajukan" | "riwayat">("ajukan");
    const [terkirim, setTerkirim] = useState(false);

    const form = useForm<PenelitianForm>({
        fakultas_id: dosen?.fakultas_id ? String(dosen.fakultas_id) : "",
        semester: "",
        tahun: tahunSekarang(),
        jumlah_dana: "",
        sumber_dana: "",
        judul: "",
        abstrak: "",
    });
    const { data, setData, errors } = form;

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTerkirim(false);
        form.clearErrors();

        const clientErrors = validateRequired(data, {
            fakultas_id: "Pilih fakultas Anda.",
            semester: "Pilih semester ganjil atau genap.",
            tahun: "Pilih tahun penelitian.",
            jumlah_dana: "Isi jumlah dana yang diajukan.",
            sumber_dana: "Pilih sumber dana internal atau eksternal.",
            judul: "Isi judul penelitian.",
            abstrak: "Isi abstrak penelitian.",
        });
        if (Object.keys(clientErrors).length > 0) {
            form.setError(clientErrors);
            focusFirstError(clientErrors);
            return;
        }

        form.post(ROUTES.penelitian, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setTerkirim(true);
                setTab("riwayat");
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
            onError: (serverErrors) => focusFirstError(serverErrors),
        });
    };

    return (
        <DosenLayout>
            <Head title="Pengajuan Penelitian" />

            <PageHeader
                icon={FlaskConical}
                title="Pengajuan Penelitian"
                description="Isi data penelitian Anda dengan lengkap. Isian bertanda wajib harus diisi sebelum dikirim."
            />

            {terkirim && (
                <SuccessBanner
                    title="Pengajuan penelitian berhasil dikirim"
                    onClose={() => setTerkirim(false)}
                >
                    Tim LPPM akan memeriksa pengajuan Anda. Pantau statusnya di
                    daftar riwayat di bawah.
                </SuccessBanner>
            )}

            <PageTabs
                value={tab}
                onChange={setTab}
                tabs={[
                    { value: "ajukan", label: "Ajukan penelitian" },
                    {
                        value: "riwayat",
                        label: "Riwayat pengajuan",
                        count: riwayat.length,
                    },
                ]}
            />

            {tab === "ajukan" ? (
                <form onSubmit={submit} noValidate className="space-y-8">
                    <FormSection
                        step={1}
                        title="Data pengajuan"
                        description="Isi keterangan waktu dan dana penelitian."
                    >
                        <Field
                            label="Fakultas"
                            htmlFor="fakultas_id"
                            required
                            error={errors.fakultas_id}
                        >
                            <SelectField
                                id="fakultas_id"
                                value={data.fakultas_id}
                                onChange={(v) => setData("fakultas_id", v)}
                                options={fakultas.map((f) => ({
                                    value: String(f.id),
                                    label: f.nama,
                                }))}
                                placeholder="Pilih fakultas"
                                invalid={!!errors.fakultas_id}
                            />
                        </Field>

                        <ChoiceCards
                            name="semester"
                            label="Semester"
                            required
                            value={data.semester}
                            onChange={(v) => setData("semester", v)}
                            options={SEMESTER_OPTIONS}
                            error={errors.semester}
                        />

                        <Field
                            label="Tahun"
                            htmlFor="tahun"
                            required
                            error={errors.tahun}
                        >
                            <SelectField
                                id="tahun"
                                value={data.tahun}
                                onChange={(v) => setData("tahun", v)}
                                options={tahunOptions(2, 1)}
                                invalid={!!errors.tahun}
                            />
                        </Field>

                        <Field
                            label="Jumlah dana"
                            htmlFor="jumlah_dana"
                            required
                            hint="Tulis angkanya saja, titik akan muncul otomatis."
                            error={errors.jumlah_dana}
                        >
                            <CurrencyInput
                                id="jumlah_dana"
                                value={data.jumlah_dana}
                                onChange={(v) => setData("jumlah_dana", v)}
                                invalid={!!errors.jumlah_dana}
                            />
                        </Field>

                        <ChoiceCards
                            name="sumber_dana"
                            label="Sumber dana"
                            required
                            value={data.sumber_dana}
                            onChange={(v) => setData("sumber_dana", v)}
                            options={SUMBER_DANA_OPTIONS}
                            error={errors.sumber_dana}
                        />
                    </FormSection>

                    <FormSection
                        step={2}
                        title="Judul dan abstrak"
                        description="Tuliskan judul dan ringkasan penelitian Anda."
                    >
                        <Field
                            label="Judul penelitian"
                            htmlFor="judul"
                            required
                            error={errors.judul}
                        >
                            <TextInput
                                id="judul"
                                value={data.judul}
                                onChange={(e) =>
                                    setData("judul", e.target.value)
                                }
                                invalid={!!errors.judul}
                                maxLength={255}
                            />
                        </Field>

                        <Field
                            label="Abstrak"
                            htmlFor="abstrak"
                            required
                            hint="Jelaskan latar belakang, tujuan, metode, dan hasil yang diharapkan."
                            error={errors.abstrak}
                        >
                            <TextArea
                                id="abstrak"
                                rows={10}
                                value={data.abstrak}
                                onChange={(e) =>
                                    setData("abstrak", e.target.value)
                                }
                                invalid={!!errors.abstrak}
                                recommendedWords={[150, 300]}
                            />
                        </Field>
                    </FormSection>

                    <SubmitBar
                        processing={form.processing}
                        label="Kirim pengajuan penelitian"
                        onReset={() => confirmReset(() => form.reset())}
                    />
                </form>
            ) : (
                <SubmissionHistory
                    items={riwayat}
                    emptyTitle="Belum ada pengajuan penelitian"
                    emptyText="Pilih tab Ajukan penelitian untuk mengirim pengajuan pertama Anda."
                />
            )}
        </DosenLayout>
    );
}
