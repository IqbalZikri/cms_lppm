import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '@/components/lppm/form-parts';
import { SubmissionHistory } from '@/components/lppm/submission-history';
import DosenLayout from '@/layouts/dosen/dosen-layout';
import { PORTAL_MENU } from '@/lib/lppm';
import type { RiwayatItem, SharedProps } from '@/types/lppm';

type Props = {
    stats: Record<'penelitian' | 'pkm' | 'hki' | 'jurnal', number>;
    terbaru: RiwayatItem[]; // 5 kiriman terakhir dari semua jenis, isi `jenis`
};

export default function Dashboard({ stats, terbaru }: Props) {
    const { props } = usePage<SharedProps>();
    const name = props.auth?.user?.name ?? 'Dosen';

    console.log(stats);
    
    return (
        <DosenLayout>
            <Head title="Beranda Dosen" />

            <PageHeader
                icon={LayoutDashboard}
                title={`Selamat datang, ${name}`}
                description="Pilih kegiatan yang ingin Anda lakukan. Semua pengajuan dan berkas Anda tersimpan di sini."
            />

            <div className="grid gap-5 md:grid-cols-2">
                {/* {PORTAL_MENU.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className="flex flex-col rounded-2xl border-2 border-slate-300 bg-white p-6 transition-colors hover:border-uca-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uca-orange-600"
                        >
                            <span className="grid size-14 place-items-center rounded-2xl bg-uca-gold-100 text-uca-green-800">
                                <Icon className="size-8" aria-hidden />
                            </span>
                            <h2 className="mt-4 font-uca-title text-2xl font-bold text-uca-green-900">{item.title}</h2>
                            <p className="mt-2 flex-1 text-lg text-slate-700">{item.description}</p>
                            <p className="mt-5 flex items-center justify-between gap-3 border-t-2 border-slate-200 pt-4 text-lg font-bold">
                                <span className="text-slate-900">
                                    {stats[item.key]} {item.unit}
                                </span>
                                <span className="text-uca-green-800 underline underline-offset-4">Buka halaman</span>
                            </p>
                        </Link>
                    );
                })} */}
            </div>

            <section aria-labelledby="judul-terbaru" className="space-y-4">
                <h2 id="judul-terbaru" className="font-uca-title text-2xl font-bold text-uca-green-900">
                    Kiriman terakhir Anda
                </h2>
                {/* <SubmissionHistory
                    items={terbaru}
                    emptyTitle="Belum ada kiriman"
                    emptyText="Pilih salah satu kegiatan di atas untuk mulai mengirim pengajuan atau berkas."
                /> */}
            </section>
        </DosenLayout>
    );
}