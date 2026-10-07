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

type Row = { command: number; volume: number; code?: string; params: string };

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
      <div>Extruded: {row.volume.toFixed(4)} mm³</div>
    </div>
  );
}

/**
 * Chart that print the extrusion amount per G-code command for the current layer.
 * Given current selected layer from useApp, gives the extrusion volume per command as array [0.2mm3, 0.1mm3, ...]
 * ParserV2 and IParser provides the computed array. 
 * This chart only render the array.
 */
export function C6_ExtrusionPerCommand() {
  const { parsedInstance, layer } = useApp();

  const volumes =
    parsedInstance?.current?.getExtrusionPerCommandArrayFromLayer(layer) ?? [];

  const commands = parsedInstance?.current?.getCommandsForLayer(layer) ?? [];

  const chartData = volumes.map((volume, index) => ({
    command: index + 1,
    volume,
    code: commands[index]?.code,
    params: describeParams(commands[index]),
  }));
  const total = volumes.reduce((sum, v) => sum + v, 0);

  return (
    <GridCardBb
      colSpan={4}
      TheIcon={IconChartBar}
      title="EXTRUSION PER COMMAND"
      value={`${total.toFixed(2)} mm³ over ${volumes.length} commands in layer ${layer}`}
    >
      <div
        className="w-full h-48"
        role="img"
        aria-label="Bar chart of extruded volume in mm³ per G-code command for the current layer"
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
              width={48}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit=" mm³"
            />
            <Tooltip content={<ExtrusionTooltip />} />
            <Bar dataKey="volume" fill="#f97316" radius={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GridCardBb>
  );
}
