import { GridCell, TabGrid } from "../../components/gridold/TabGrid";
import Grid from "../../components/gridold/Grid";
import { useApp } from "../../context/AppContext";
import Label from "@/components/gui/Label";
import VList from "@/components/guiv2/VList";
import DashContContainer from "@/components/gui/DashContContainer";
import NavigationControlNew from "./NavigationControlNew";

export function TabCmdAnalysisOld() {
  const { parsedInstance, layer, command } = useApp();

  return (
    <DashContContainer
      title="Command Analysis (Old)"
      description="Analysis of the G-code commands for the current print using the old method."
    >
      <TabGrid>
        {/* Navigation - Full width Row 1 */}
        <GridCell colStart={1} colEnd={5} rowStart={1}>
          <NavigationControlNew />
        </GridCell>

        {/* <GridCell colStart={1} colEnd={5} rowStart={1}>
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
        </GridCell> */}

        {/* Current Command - Left 2 columns, Row 2 */}
        <GridCell colStart={1} colEnd={3} rowStart={2}>
          <VList>
            <h3>Current Command</h3>
            <Label
              title="G-Code Line"
              value={
                parsedInstance.current?.getCommand(layer, command)?.line ||
                "N/A"
              }
            />
            <Label
              title="Command Type"
              value={
                parsedInstance.current?.getCommand(layer, command)?.code ||
                "N/A"
              }
            />
          </VList>
        </GridCell>

        {/* Position Coordinates - Right 2 columns, Row 2 */}
        <GridCell colStart={3} colEnd={5} rowStart={2}>
          <VList>
            <h3>Position Coordinates</h3>
            <Grid maxCol={2}>
              <Label
                title="X Position"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.x?.toFixed(3) || "N/A"
                }
                unit="mm"
              />
              <Label
                title="Y Position"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.y?.toFixed(3) || "N/A"
                }
                unit="mm"
              />
              <Label
                title="Z Position"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.z?.toFixed(3) || "N/A"
                }
                unit="mm"
              />
              <Label
                title="E Position"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.e?.toFixed(3) || "N/A"
                }
                unit="mm"
              />
            </Grid>
          </VList>
        </GridCell>

        {/* Movement Metrics - Left 2 columns, Row 3 */}
        <GridCell colStart={1} colEnd={3} rowStart={3}>
          <VList>
            <h3>Movement Metrics</h3>
            <Grid maxCol={2}>
              <Label
                title="Travel Distance"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.distance?.toFixed(3) || "0.000"
                }
                unit="mm"
              />
              <Label
                title="Last Seen Z"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.last_seen_z?.toFixed(3) || "N/A"
                }
                unit="mm"
              />
            </Grid>
          </VList>
        </GridCell>

        {/* Extrusion Data - Right 2 columns, Row 3 */}
        <GridCell colStart={3} colEnd={5} rowStart={3}>
          <VList>
            <h3>Extrusion Data</h3>
            <Grid maxCol={2}>
              <Label
                title="Extruded Volume"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.extruded_volume_mm3?.toFixed(3) || "0.000"
                }
                unit="mm³"
              />
              <Label
                title="Volume per Distance"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.volume_per_distance?.toFixed(3) || "0.000"
                }
                unit="mm³/mm"
              />
            </Grid>
          </VList>
        </GridCell>

        {/* Speed & Flow - Full width Row 4 */}
        <GridCell colStart={1} colEnd={5} rowStart={4}>
          <VList>
            <h3>Speed & Flow</h3>
            <Grid maxCol={3}>
              <Label
                title="Velocity"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.velocity_mm_s?.toFixed(3) || "0.000"
                }
                unit="mm/s"
              />
              <Label
                title="Feed Rate"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.last_seen_f_mm_s?.toFixed(3) || "N/A"
                }
                unit="mm/s"
              />
              <Label
                title="Flow Rate"
                value={
                  parsedInstance.current
                    ?.getCommand(layer, command)
                    ?.flow_mm3_s?.toFixed(3) || "0.000"
                }
                unit="mm³/s"
              />
            </Grid>
          </VList>
        </GridCell>
      </TabGrid>
    </DashContContainer>
  );
}
