import { GridCell, TabGrid } from "../components/TabGrid";
import NavigationControl from "../components/NavigationControl";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import GcodeCanvas from "../components/core/GcodeCanvas";
import { useApp } from "../context/AppContext";

export function TabVisualizationPage() {
  const {
    parsedInstance,
    layer,
    command,
    prevLayer,
    nextLayer,
    prevCommand,
    nextCommand,
    restCommand,
    resetLayer,
  } = useApp();

  const renderCanvas = () => {
    if (!parsedInstance.current) {
      return null;
    }

    return (
      <GcodeCanvas
        points={parsedInstance.current.getValidXYCommandsForLayer(
          layer,
          command,
        )}
      />
    );
  };

  return (
    <TabGrid>
      {/* Navigation - Full width Row 1 */}
      <GridCell colStart={1} colEnd={5} rowStart={1}>
        <NavigationControl
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
        />
      </GridCell>

      {/* Canvas Visualization - Full width Rows 2-4 */}
      <GridCell colStart={1} colEnd={5} rowStart={2} rowEnd={5}>
        <h2>Canvas Visualization</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            padding: "24px",
            borderRadius: "4px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          {renderCanvas()}
        </div>
      </GridCell>

      {/* Extrusion Timeline - Full width Rows 5-6 */}
      <GridCell colStart={1} colEnd={5} rowStart={5} rowEnd={7}>
        <h2>Extrusion Timeline</h2>
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            padding: "24px",
            borderRadius: "4px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          <BarChart
            width={800}
            height={300}
            data={parsedInstance.current
              ?.getValidXYCommandsForLayer(layer)
              .map((cmd) => {
                return {
                  bin: cmd.code,
                  coount: cmd.extruded_volume_mm3 ? cmd.extruded_volume_mm3 : 1,
                };
              })}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="bin"
              tick={{ fill: "#64748b", fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#colorGradient2)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </BarChart>
        </div>
      </GridCell>
    </TabGrid>
  );
}
