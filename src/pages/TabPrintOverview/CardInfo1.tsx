import { Printer } from "lucide-react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GridCard } from "@/components/grid/GridCard";
import { Metric } from "./Metric";
import { useApp } from "@/context/AppContext";

export function CardInfo1() {
  const { parsedInstance, isLoaded } = useApp();

  if (!isLoaded || !parsedInstance?.current) {
    return (
      <GridCard $colSpan={2}>
        <CardContent>Not loaded</CardContent>
      </GridCard>
    );
  }

  return (
    <GridCard $colSpan={2}>
      <CardHeader>
        {/* PRINT OVERVIEW */}
        <CardDescription className="flex items-center gap-2">
          <Printer className="size-4" aria-hidden="true" />
          Print overview
        </CardDescription>
        {/* FILENAME */}
        <CardTitle className="text-xl">
          {parsedInstance.current.getFileName()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Metric
            label="Total layers"
            value={parsedInstance.current.getLayersCountStr()}
          />

          <Metric
            label="Print time"
            value={parsedInstance.current.getPrintTime()}
          />

          <Metric
            label="Filament"
            value={parsedInstance.current.getTotalMaterialUsedStr()}
          />

          <Metric
            label="Nozzle"
            value={parsedInstance.current.getNozzleSize()}
          />
        </div>
      </CardContent>
    </GridCard>
  );
}
