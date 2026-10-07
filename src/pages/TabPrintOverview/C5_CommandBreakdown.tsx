import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { useApp } from "@/context/AppContext";
import { IconChartBar } from "@tabler/icons-react";

// Returns a histogram array for the specified layer, showing the count of each G-code command.
// Example: [ "G1: 120", "G0: 30", "M104: 5" ]
const BAR_COLORS = [
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#d946ef",
];

export function C5_CommandBreakdown() {
  const { parsedInstance, layer } = useApp(); // Assuming you have a context providing the parser instance

  // Returns a histogram array for the specified layer, showing the count of each G-code command.
  // Example: [ "G1: 120", "G0: 30", "M104: 5" ]
  // getHistogramArrayFromLayer(layer: number): Array<string>;

  const histogram =
    parsedInstance?.current?.getHistogramArrayFromLayer(layer) ?? [];

  // Entries look like "G1: 120"; sorted so the most used command is row 1.
  const chartData = histogram
    .map((entry) => {
      const separator = entry.lastIndexOf(":");
      return {
        command: entry.slice(0, separator).trim(),
        count: Number(entry.slice(separator + 1)),
      };
    })
    .filter((row) => row.command && Number.isFinite(row.count))
    .sort((a, b) => b.count - a.count);

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconChartBar}
      title="COMMAND BREAKDOWN"
      value={`${chartData.length} commands total for layer ${layer}`}
    >
      <div
        className="w-full"
        style={{ height: Math.max(192, chartData.length * 28 + 16) }}
        role="img"
        aria-label="Bar chart of G-code command counts for the current layer, most used first"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="command"
              width={80}
              interval={0}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(value) => [value, "Count"]} />
            <Bar dataKey="count" radius={4}>
              {chartData.map((row, index) => (
                <Cell
                  key={row.command}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
