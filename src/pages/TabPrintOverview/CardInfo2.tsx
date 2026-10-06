import {
  Layers3,
  // Activity,
  // Clock3,
  // Printer,
  // ShieldCheck,
  // Thermometer,
  // Waves,
  // Weight,
} from "lucide-react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GridCard } from "@/components/grid/GridCard";

const layerHeights = [34, 47, 61, 76, 89, 100, 94, 82, 68, 52, 38, 24];

export function CardInfo2() {
  return (
    <GridCard $colSpan={2}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Layers3 className="size-4" aria-hidden="true" />
          Layer profile
        </CardDescription>
        <CardTitle>0.20 mm</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex h-16 items-end gap-1"
          role="img"
          aria-label="Mock layer height profile across the print"
        >
          {layerHeights.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-primary/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Consistent height across the model
        </p>
      </CardContent>
    </GridCard>
  );
}
