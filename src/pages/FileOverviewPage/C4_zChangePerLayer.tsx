import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { useApp } from "@/context/AppContext";
import { IconWalk } from "@tabler/icons-react";

export function C4_zChangePerLayer() {
  const { parsedInstance } = useApp(); // Assuming you have a context providing the parser instance

  const zChangesPerLayerArray =
    parsedInstance?.current?.getAllHeightChangesLayerArray() ?? [];

  const chartData = zChangesPerLayerArray.map((value, index) => ({
    layer: `Layer ${index + 1}`,
    value,
  }));

  const sum = zChangesPerLayerArray.reduce((acc, curr) => acc + curr, 0);

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconWalk}
      title="Z CHANGE PER LAYER"
      value={`${chartData.length} layer samples (${sum.toFixed(2)} mm total)`}
    >
      <div
        className="h-48 w-full"
        role="img"
        aria-label="Bar chart of Z change per layer in millimeters, with 10 millimeters of padding on each side"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="category"
              dataKey="layer"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              domain={["dataMin - 10", "dataMax + 10"]}
              tickCount={5}
              tickFormatter={(value: number) =>
                `${Number(value.toFixed(2))} mm`
              }
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={0} stroke="var(--muted-foreground)" />
            <Tooltip
              formatter={(value) => [
                `${typeof value === "number" ? value.toFixed(2) : value} mm`,
                "Z change",
              ]}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
