import PublicAppLayout from "@/layouts/public/public-layout";

export default function Halaman({ judul, deskripsi }: { judul: string; deskripsi: string }) {
    return (
        <PublicAppLayout title={judul}>
            <section className="bg-forest text-primary-foreground">
                <div className="page-shell py-16 md:py-24">
                    <h1 className="font-display text-4xl md:text-6xl">{judul}</h1>
                    <p className="mt-4 max-w-2xl text-primary-foreground/75">{deskripsi}</p>
                </div>
            </section>
            <section className="section-pad">
                <div className="page-shell text-muted-foreground">Konten halaman ini belum diisi.</div>
            </section>
        </PublicAppLayout>
    );
}
