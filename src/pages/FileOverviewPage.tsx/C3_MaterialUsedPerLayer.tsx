import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { useApp } from "@/context/AppContext";
import { IconWeight } from "@tabler/icons-react";

export function C3_MaterialUsedPerLayer() {
  const { parsedInstance } = useApp(); // Assuming you have a context providing the parser instance

  const layerMaterialUsedGArray =
    parsedInstance?.current?.getLayerMaterialUsedGArray() ?? [];

  const materialUsedPerLayerChartData = layerMaterialUsedGArray.map(
    (height, index) => ({
      layer: `Layer ${index + 1}`,
      height,
    }),
  );

  const sum = layerMaterialUsedGArray.reduce((acc, curr) => acc + curr, 0);

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconWeight}
      title="MATERIAL USED PER LAYER"
      value={`${materialUsedPerLayerChartData.length} layer samples (${sum.toFixed(2)} g total)`}
    >
      <div
        className="h-48 w-full"
        role="img"
        aria-label="Bar chart of material used per layer in grams"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={materialUsedPerLayerChartData}
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
              domain={[0, (dataMax: number) => dataMax * 1.1]}
              tickCount={4}
              tickFormatter={(value: number) => `${Number(value.toFixed(2))} g`}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                `${typeof value === "number" ? value.toFixed(2) : value} g`,
                "Used",
              ]}
            />
            <Bar dataKey="height" fill="var(--primary)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
