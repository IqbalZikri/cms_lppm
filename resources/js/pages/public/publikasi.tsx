import { ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IMG, publications } from '@/lib/data';
import PublicAppLayout from '@/layouts/public/public-layout';
import { input, PageHero } from '@/components/public/ui';

const tabs = ['Semua', 'Scopus', 'SINTA', 'Prosiding', 'HKI'];
export default function Publikasi() {
  const [tab, setTab] = useState('Semua'); const [q, setQ] = useState('');
  const list = useMemo(() => publications.filter(p => (tab === 'Semua' || p.type === tab) && (p.title + p.authors + p.venue).toLowerCase().includes(q.toLowerCase())), [tab, q]);
  return (
    <PublicAppLayout title="Publikasi">
      <PageHero title="Kumpulan publikasi" subtitle="Artikel jurnal, prosiding, dan HKI karya dosen UCA." image={IMG.kampus} />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap gap-2">{tabs.map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 font-semibold ${tab === t ? 'bg-uca-green text-white' : 'bg-white text-uca-green ring-1 ring-uca-green/30'}`}>{t}</button>)}</div>
        <input className={input + ' mt-4'} placeholder="Cari judul, penulis, atau nama jurnal" aria-label="Cari publikasi" value={q} onChange={e => setQ(e.target.value)} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map(p => (
            <article key={p.id} className="flex flex-col rounded-2xl bg-white p-5 shadow">
              <span className="w-fit rounded bg-uca-red px-2 py-1 text-xs font-bold text-white">{p.type}</span>
              <h2 className="font-display mt-2 text-lg font-bold text-uca-green">{p.title}</h2>
              <p className="mt-1 text-slate-700">{p.authors}</p>
              <p className="text-sm text-slate-500">{p.venue}, {p.year}</p>
              <a href={p.link} className="mt-3 inline-flex items-center gap-1 pt-1 font-semibold text-uca-red">Buka publikasi <ExternalLink size={16} /></a>
            </article>))}
        </div>
        {list.length === 0 && <p className="mt-6 rounded-2xl bg-white p-8 text-center font-semibold text-uca-green">Belum ada publikasi yang cocok.</p>}
      </div>
    </PublicAppLayout>
  );
}
