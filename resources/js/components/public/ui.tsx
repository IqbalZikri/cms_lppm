import { motion, useInView, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

export function PageHero({
    title,
    subtitle,
    image,
}: {
    title: string;
    subtitle?: string;
    image: string;
}) {
    return (
        <header className="relative isolate overflow-hidden bg-uca-deep">
            <img
                src={image}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-uca-deep via-uca-deep/80 to-transparent" />
            <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
                <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-3 max-w-2xl text-lg text-white/80">
                        {subtitle}
                    </p>
                )}
                <div className="mt-6 h-1 w-20 rounded bg-uca-gold" />
            </div>
        </header>
    );
}

export function Section({
    title,
    hint,
    action,
    children,
}: {
    title: string;
    hint?: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="mx-auto max-w-6xl px-5 py-12">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="font-display text-3xl font-bold text-uca-green">
                        {title}
                    </h2>
                    {hint && <p className="mt-1 text-slate-600">{hint}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export function Reveal({
    children,
    delay = 0,
}: {
    children: ReactNode;
    delay?: number;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay }}
        >
            {children}
        </motion.div>
    );
}

export function CountUp({ to }: { to: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const t0 = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min((t - t0) / 1400, 1);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to]);
    return <span ref={ref}>{n}</span>;
}

export const input =
    "w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base focus:border-uca-green";
export const btn =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-uca-green px-5 py-3 font-semibold text-white transition hover:bg-uca-deep";
