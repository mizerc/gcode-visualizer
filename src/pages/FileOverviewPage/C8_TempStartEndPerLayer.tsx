import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { useApp } from "@/context/AppContext";
import { IconChartBar } from "@tabler/icons-react";

const SERIES = [
  { key: "hotend", label: "Hotend °C", color: "#ef4444" },
  { key: "bed", label: "Bed °C", color: "#3b82f6" },
  { key: "fan", label: "Fan PWM", color: "#22c55e" },
] as const;

type Key = (typeof SERIES)[number]["key"];

interface Row {
  layer: number;
  hotend: [number, number];
  bed: [number, number];
  fan: [number, number];
  raw: Record<Key, { start: number; end: number }>;
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: Row }[];
}

function SegmentTooltip({ active, payload }: TooltipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded border border-border bg-card px-2 py-1 text-xs">
      <div className="font-medium">Layer {row.layer}</div>
      {SERIES.map((s) => (
        <div key={s.key} style={{ color: s.color }}>
          {s.label}: {row.raw[s.key].start} → {row.raw[s.key].end}
        </div>
      ))}
    </div>
  );
}

/**
 * C8_TempStartEndPerLayer
 * Start→end segment of hotend, bed and fan per layer.
 * ParserV2 and IParser provide the computed array.
 */
export function C8_TempStartEndPerLayer() {
  const { parsedInstance } = useApp();

  const snapshots =
    parsedInstance?.current?.getTemperatureStartEndPerLayerArray() ?? [];

  const chartData: Row[] = snapshots.map(({ start, end }, i) => ({
    layer: i + 1,
    hotend: [start.hotend_c, end.hotend_c],
    bed: [start.bed_c, end.bed_c],
    fan: [start.fan_pwm, end.fan_pwm],
    raw: {
      hotend: { start: start.hotend_c, end: end.hotend_c },
      bed: { start: start.bed_c, end: end.bed_c },
      fan: { start: start.fan_pwm, end: end.fan_pwm },
    },
  }));

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconChartBar}
      title="TEMPERATURE & FAN START → END PER LAYER"
      value={`${chartData.length} layers`}
    >
      <div
        className="w-full h-48"
        role="img"
        aria-label="Chart of hotend, bed and fan start to end values per layer"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={0}
            margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="layer"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={40}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<SegmentTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {SERIES.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                barSize={3}
                minPointSize={2}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
