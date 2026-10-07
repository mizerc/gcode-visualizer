import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Command } from "@/core/ParserV2";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { useApp } from "@/context/AppContext";
import { IconChartBar } from "@tabler/icons-react";

type Row = { command: number; ratio: number; code?: string; params: string };

// Only G0/G1 moves show their X/Y/Z/F/E parameters (when present).
function describeParams(cmd?: Command): string {
  if (!cmd || (cmd.code !== "G0" && cmd.code !== "G1")) return "";
  const parts: string[] = [];
  if (cmd.x !== undefined) parts.push(`X${cmd.x}`);
  if (cmd.y !== undefined) parts.push(`Y${cmd.y}`);
  if (cmd.z !== undefined) parts.push(`Z${cmd.z}`);
  if (cmd.feedrate_mm_min !== undefined) parts.push(`F${cmd.feedrate_mm_min}`);
  if (cmd.e !== undefined) parts.push(`E${cmd.e}`);
  return parts.join(" ");
}

function ExtrusionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow">
      <div className="font-medium">
        Command #{row.command}
        {row.code ? ` · ${row.code}` : ""}
      </div>
      {row.params && <div className="text-muted-foreground">{row.params}</div>}
      <div>Extrusion: {row.ratio.toFixed(4)} mm³/mm</div>
    </div>
  );
}

/**
 * C7_ExtrusionPerDistance
 * Chart that print the extrusion amount in mm3 per distance for each command.
 * Given current selected layer from useApp, gives the extrusion volume per command, divided by the distance traveled, as array [0.2mm3/mm, 0.1mm3/mm, ...]
 * ParserV2 and IParser provides the computed array. 
 * This chart only render the array.
 */
export function C7_ExtrusionPerDistance() {
  const { parsedInstance, layer } = useApp();

  const volumes =
    parsedInstance?.current?.getExtrusionPerDistanceArrayFromLayer(layer) ?? [];

  const commands = parsedInstance?.current?.getCommandsForLayer(layer) ?? [];

  const chartData = volumes.map((volume, index) => ({
    command: index + 1,
    ratio: volume,
    code: commands[index]?.code,
    params: describeParams(commands[index]),
  }));
  const nonZero = volumes.filter((v) => v > 0);
  const average =
    nonZero.length > 0 ? nonZero.reduce((s, v) => s + v, 0) / nonZero.length : 0;

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconChartBar}
      title="EXTRUSION PER DISTANCE"
      value={`avg ${average.toFixed(4)} mm³/mm over ${nonZero.length} extruding commands in layer ${layer}`}
    >
      <div
        className="w-full h-48"
        role="img"
        aria-label="Bar chart of extruded volume per distance in mm³/mm per G-code command for the current layer"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="command"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={72}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit=" mm³/mm"
            />
            <Tooltip content={<ExtrusionTooltip />} />
            <Bar dataKey="ratio" fill="#f97316" radius={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
