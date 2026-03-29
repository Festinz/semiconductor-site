"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const SAMSUNG_COLOR = "#1428A0";
const HYNIX_COLOR = "#E4002B";

interface MetricRow {
  label: string;
  unit: string;
  samsung: number | null;
  hynix: number | null;
  jedec: number | null;
  samsungExtra?: string;
  hynixExtra?: string;
}

interface CompanyComparisonCardProps {
  lineup: string;
  fullName: string;
  metrics: MetricRow[];
  samsungStatus: string;
  hynixStatus: string;
  samsungDiff: string;
  hynixDiff: string;
  samsungUpdated: string;
  hynixUpdated: string;
  highlightCompany: "samsung" | "hynix";
}

function formatDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-gray-200 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="text-gray-100 font-medium">
            {entry.value != null ? entry.value : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-6 mt-2 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SAMSUNG_COLOR }} />
        <span className="text-gray-400">삼성</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: HYNIX_COLOR }} />
        <span className="text-gray-400">하이닉스</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-6 border-t-2 border-dashed border-amber-500" />
        <span className="text-gray-400">JEDEC 기준</span>
      </div>
    </div>
  );
}

export default function CompanyComparisonCard({
  lineup,
  fullName,
  metrics,
  samsungStatus,
  hynixStatus,
  samsungDiff,
  hynixDiff,
  samsungUpdated,
  hynixUpdated,
  highlightCompany,
}: CompanyComparisonCardProps) {
  // Filter metrics that have at least one non-null value
  const validMetrics = metrics.filter(
    (m) => m.samsung != null || m.hynix != null
  );

  // Build chart data
  const chartData = validMetrics.map((m) => ({
    name: `${m.label} (${m.unit})`,
    삼성: m.samsung,
    하이닉스: m.hynix,
    jedec: m.jedec,
    unit: m.unit,
  }));

  // Find max JEDEC value for reference lines
  const jedecLines = validMetrics
    .filter((m) => m.jedec != null)
    .map((m) => ({
      label: m.label,
      value: m.jedec!,
      name: `${m.label} (${m.unit})`,
    }));

  const hasChartData = chartData.some(
    (d) => d["삼성"] != null || d["하이닉스"] != null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm"
    >
      {/* Card header */}
      <div className="p-6 border-b border-gray-800/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{lineup}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{fullName}</p>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SAMSUNG_COLOR }} />
                <span className="text-xs text-gray-300">삼성</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">{samsungStatus}</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: HYNIX_COLOR }} />
                <span className="text-xs text-gray-300">하이닉스</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">{hynixStatus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="p-6">
        {hasChartData ? (
          <>
            <div className="w-full h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2937"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  {/* JEDEC reference lines */}
                  {jedecLines.map((jl) => (
                    <ReferenceLine
                      key={jl.label}
                      x={jl.value}
                      stroke="#f59e0b"
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      label={{
                        value: `JEDEC ${jl.value}`,
                        position: "top",
                        fill: "#f59e0b",
                        fontSize: 10,
                      }}
                    />
                  ))}
                  <Bar
                    dataKey="삼성"
                    fill={SAMSUNG_COLOR}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="하이닉스"
                    fill={HYNIX_COLOR}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <CustomLegend />
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm text-gray-600">수치 데이터 수집 중...</p>
          </div>
        )}
      </div>

      {/* Detail table — visible metrics with extras and notes */}
      <div className="px-6 pb-6 overflow-x-auto">
        <table className="w-full text-xs min-w-[320px]">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 text-gray-500 font-medium">지표</th>
              <th className="text-right py-2 font-medium" style={{ color: SAMSUNG_COLOR }}>
                삼성
              </th>
              <th className="text-right py-2 font-medium" style={{ color: HYNIX_COLOR }}>
                하이닉스
              </th>
              <th className="text-right py-2 text-amber-500 font-medium">JEDEC</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.label} className="border-b border-gray-800/40">
                <td className="py-2.5 text-gray-400">
                  {m.label}
                  <span className="text-gray-600 ml-1">({m.unit})</span>
                </td>
                <td className="py-2.5 text-right text-gray-200 font-medium">
                  {m.samsung != null ? m.samsung : "-"}
                  {m.samsungExtra && (
                    <span className="text-[10px] text-gray-500 ml-1">{m.samsungExtra}</span>
                  )}
                </td>
                <td className="py-2.5 text-right text-gray-200 font-medium">
                  {m.hynix != null ? m.hynix : "-"}
                  {m.hynixExtra && (
                    <span className="text-[10px] text-gray-500 ml-1">{m.hynixExtra}</span>
                  )}
                </td>
                <td className="py-2.5 text-right text-amber-500/70">
                  {m.jedec != null ? m.jedec : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Differentiators */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-blue-500/15 bg-blue-950/10 p-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">삼성 차별점</p>
            <p className="text-xs text-gray-300">{samsungDiff || "-"}</p>
          </div>
          <div className="rounded-lg border border-red-500/15 bg-red-950/10 p-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">하이닉스 차별점</p>
            <p className="text-xs text-gray-300">{hynixDiff || "-"}</p>
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600">
          <span>삼성 업데이트: {formatDate(samsungUpdated)}</span>
          <span>하이닉스 업데이트: {formatDate(hynixUpdated)}</span>
        </div>
      </div>
    </motion.div>
  );
}
