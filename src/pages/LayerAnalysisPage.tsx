import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Histogram from "../components/core/Histogram";
import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "../components/core/LayerAndCommandPicker";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridCard } from "@/components/grid/GridCard";
import FieldTable, { type FieldRow } from "@/components/gui/FieldTable";
import { C5_CommandBreakdown } from "./TabPrintOverview/C5_CommandBreakdown";

export function LayerAnalysisPage() {
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
      </GridContainer>
    </DashContContainer>
  );
}
