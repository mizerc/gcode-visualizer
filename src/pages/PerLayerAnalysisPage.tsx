import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "../components/core/LayerAndCommandPicker";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridCard } from "@/components/grid/GridCard";
import FieldTable, { type FieldRow } from "@/components/gui/FieldTable";
import { C5_CommandBreakdown } from "./FileOverviewPage/C5_CommandBreakdown";
import { C6_ExtrusionPerCommand } from "./FileOverviewPage/C6_ExtrusionPerCommand";
import { C7_ExtrusionPerDistance } from "./FileOverviewPage/C7_ExtrusionPerDistance";
import { C8_TempStartEndPerLayer } from "./FileOverviewPage/C8_TempStartEndPerLayer";

export function PerLayerAnalysisPage() {
  const { parsedInstance, layer } = useApp();

  const generalRows: FieldRow[] = [
    //
    {
      label: "Total Commands for Layer",
      value: parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
    },
  ];

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

        <C5_CommandBreakdown />
        <C6_ExtrusionPerCommand />
        <C7_ExtrusionPerDistance />
        <C8_TempStartEndPerLayer />
      </GridContainer>
    </DashContContainer>
  );
}
