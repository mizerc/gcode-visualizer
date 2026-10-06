import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Heading3 } from "../components/gui/Heading3";
import TextArea from "../components/gui/TextArea";
import Histogram from "../components/core/Histogram";
import Label from "../components/gui/Label";
import { GridCell } from "../components/gridold/TabGrid";
import VList from "../components/guiv2/VList";
import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import NavigationControlNew from "./TabCmdAnalysisOld/NavigationControlNew";

export function LayerViewPage() {
  const { parsedInstance, layer, command } = useApp();

  return (
    <DashContContainer
      title="Per-Layer Content View"
      description="Isolate the content of each layer"
    >
      <GridCell colStart={1} colEnd={5} rowStart={1}>
        <NavigationControlNew />

        {/* <NavigationControl
          layerCount={parsedInstance.current?.getLayersCount() || 0}
          currentLayer={layer}
          commandsCount={
            parsedInstance.current?.getCommandsCountForLayer(layer) || 0
          }
          currentCommand={command}
          onPrevLayer={prevLayer}
          onNextLayer={nextLayer}
          onResetLayer={resetLayer}
          onPrevCommand={prevCommand}
          onNextCommand={nextCommand}
          onResetCommand={restCommand}
        /> */}
      </GridCell>

      {/* Commands of Current Layer - Left 3 columns, Rows 2-3 */}
      <GridCell colStart={1} colEnd={4} rowStart={1} rowEnd={2}>
        <VList>
          <Heading3>COMMANDS OF CURRENT LAYER</Heading3>
          <TextArea
            value={
              parsedInstance.current
                ?.getCommandsForLayer(layer)
                .map((command) => {
                  return `line: ${command.line}\nCMD: ${command.code}, X: ${command.x}, Y: ${command.y}, Z: ${command.z}, E: ${command.e}, F: ${command.f}\n`;
                })
                .join("\n") || ""
            }
          />
        </VList>
      </GridCell>

      {/* Current Command Info - Right column, Rows 2-3 */}
      <GridCell colStart={1} colEnd={5} rowStart={2} rowEnd={3}>
        <VList>
          <Heading3>CURRENT COMMAND</Heading3>
          <Label
            title={`Index ${command}`}
            value={
              parsedInstance.current?.getCommand(layer, command)?.line || "N/A"
            }
          />
          <Label
            title="Command Type"
            value={
              parsedInstance.current?.getCommand(layer, command)?.code || "N/A"
            }
          />
        </VList>
      </GridCell>

      {/* Command Distribution - Full width Row 4 */}
      <GridCell colStart={1} colEnd={5} rowStart={4}>
        <Heading3>Command Distribution</Heading3>
        <Histogram
          data={parsedInstance.current?.getHistogramArrayFromLayer(layer) || []}
        />
      </GridCell>

      {/* Extrusion Volume Chart - Full width Rows 5-6 */}
      <GridCell colStart={1} colEnd={5} rowStart={5} rowEnd={7}>
        <Heading3>Extrusion Volume per Command</Heading3>
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            padding: "24px",
            borderRadius: "4px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            overflowX: "auto",
          }}
        >
          <BarChart
            width={Math.max(
              800,
              (parsedInstance.current?.getCommandsCountForLayer(layer) || 0) *
                8,
            )}
            height={300}
            data={parsedInstance.current
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
              })}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
            {/*             
            <Tooltip
              contentStyle={{
                background: "white",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              labelStyle={{ color: "#1e293b", fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (name === "volume")
                  return [value.toFixed(3) + " mm³", "Extrusion Volume"];
                return [value, name];
              }}
            /> */}
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
        </div>
      </GridCell>
    </DashContContainer>
  );
}
