import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type ChartPoint = {
    periode: string;
    penelitian: number;
    publikasi: number;
    pkm: number;
};

const GREEN = "#0b5a2b"; // sesuaikan dengan warna UCA
const GOLD = "#c9a13b";
const ORANGE = "#e07b2a";

export default function TrenChart({ data }: { data: ChartPoint[] }) {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="fillPenelitian"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={GREEN}
                                stopOpacity={0.25}
                            />
                            <stop
                                offset="100%"
                                stopColor={GREEN}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e5e0"
                    />
                    <XAxis
                        dataKey="periode"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip />
                    <Legend iconType="square" />

                    {/* Publikasi: hanya garis */}
                    <Area
                        type="monotone"
                        dataKey="publikasi"
                        name="Publikasi"
                        stroke={GOLD}
                        strokeWidth={3}
                        fill="none"
                        dot={false}
                    />

                    {/* Penelitian: garis + area gradasi */}
                    <Area
                        type="monotone"
                        dataKey="penelitian"
                        name="Penelitian"
                        stroke={GREEN}
                        strokeWidth={3}
                        fill="url(#fillPenelitian)"
                        dot={false}
                    />

                    {/* PKM (opsional) */}
                    <Area
                        type="monotone"
                        dataKey="pkm"
                        name="PKM"
                        stroke={ORANGE}
                        strokeWidth={3}
                        fill="none"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
