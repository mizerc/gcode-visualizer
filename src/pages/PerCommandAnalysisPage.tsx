import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "@/components/core/LayerAndCommandPicker";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridCard } from "@/components/grid/GridCard";
import FieldTable, { type FieldRow } from "@/components/gui/FieldTable";

export function PerCommandAnalysisPage() {
  const { parsedInstance, layer, command } = useApp();

  const currentCommand = parsedInstance.current?.getCommand(layer, command);

  return (
    <DashContContainer
      title="Per-Command Analysis"
      description="Visualize what each command is doing"
    >
      <LayerAndCommandPicker />

      <GridContainer>
        <GridCard $colSpan={4} title="Per-Layer Information">
          <FieldTable
            rows={[
              {
                label: "Total Commands",
                value:
                  parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
              },
            ]}
          />
        </GridCard>

        <GridCard $colSpan={2} title="Parsed Command">
          <FieldTable
            rows={[
              {
                label: "Raw Line",
                value: currentCommand?.line || "N/A",
              },
              {
                label: "Type",
                value: currentCommand?.code || "N/A",
              },

              // Position Coordinates
              {
                label: "Target X Position",
                value: currentCommand?.x?.toFixed(3) || "N/A",
                unit: "mm",
              },
              {
                label: "Target Y Position",
                value: currentCommand?.y?.toFixed(3) || "N/A",
                unit: "mm",
              },
              {
                label: "Target Z Position",
                value: currentCommand?.z?.toFixed(3) || "N/A",
                unit: "mm",
              },
              {
                label: "Target E Position (mm)",
                value: currentCommand?.e?.toFixed(3) || "N/A",
                unit: "mm",
              },
              {
                label: "Feed rate (mm/min)",
                value: currentCommand?.feedrate_mm_min?.toFixed(3) || "N/A",
                unit: "mm",
              },
            ]}
          />
        </GridCard>

        <GridCard $colSpan={2} title="Deltas">
          <FieldTable
            rows={[
              {
                label: "Extruded Amout (mm3)",
                value: currentCommand?.extruded_volume_mm3?.toFixed(3) || "N/A",
              },
              {
                label: "Distance Traveled (mm)",
                value: currentCommand?.distance?.toFixed(3) || "N/A",
              },
              // volume_per_distance
              {
                label: "Volume per Distance (mm3/mm)",
                value: currentCommand?.volume_per_distance?.toFixed(3) || "N/A",
              },
              {
                label: "Weight (g)",
                value: currentCommand?.weight_g?.toFixed(3) || "N/A",
              },
            ]}
          />
        </GridCard>
      </GridContainer>
    </DashContContainer>
  );
}
