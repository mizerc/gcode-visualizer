import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Histogram from "../components/core/Histogram";
import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "../components/core/LayerAndCommandPicker";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridCard } from "@/components/grid/GridCard";
import FieldTable, { type FieldRow } from "@/components/gui/FieldTable";

export function LayerAnalysisPage() {
  const { parsedInstance, layer } = useApp();

  const generalRows: FieldRow[] = [
    //
    {
      label: "Total Commands",
      value: parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
    },
  ];

  const extrusionData = parsedInstance.current
    ?.getValidXYCommandsForLayer(
      layer,
      parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
    )
    .map((cmd, index) => {
      return {
        index: index,
        volume: cmd.extruded_volume_mm3 || 0,
        code: cmd.code,
      };
    });

  return (
    <DashContContainer
      title="Per-Layer Analysis"
      description="Isolate the content of each layer"
    >
      <LayerAndCommandPicker hiddeCommand />

      <GridContainer>
        <GridCard $colSpan={4} title="Layer Information">
          <FieldTable rows={generalRows} />
        </GridCard>

        {/* EXTRUSION VOLUME */}
        <GridCard $colSpan={4} title="Extrusion Volume per Command">
          <BarChart
            data={extrusionData}
            height={400}
            width={"100%"}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="index"
              label={{
                value: "Command Index",
                position: "insideBottom",
                offset: -10,
                style: { fill: "#64748b", fontWeight: 600 },
              }}
              tick={{ fill: "#64748b", fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <YAxis
              label={{
                value: "Extrusion Volume (mm³)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#64748b", fontWeight: 600 },
              }}
              tick={{ fill: "#64748b", fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <Bar
              dataKey="volume"
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </BarChart>
        </GridCard>

        <GridCard $colSpan={4} title="Command Distribution">
          <Histogram
            data={
              parsedInstance.current?.getHistogramArrayFromLayer(layer) || []
            }
          />
        </GridCard>
      </GridContainer>
    </DashContContainer>
  );
}
