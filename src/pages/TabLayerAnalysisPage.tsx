import {
  Activity,
  Clock3,
  Layers3,
  Printer,
  ShieldCheck,
  Thermometer,
  Waves,
  Weight,
} from "lucide-react";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridCard } from "@/components/grid/GridCard";
import DashContContainer from "@/components/gui/DashContContainer";

const layerHeights = [34, 47, 61, 76, 89, 100, 94, 82, 68, 52, 38, 24];
const movementBreakdown = [
  { label: "Print moves", value: 68, color: "bg-primary" },
  { label: "Travel moves", value: 22, color: "bg-sky-500" },
  { label: "Retractions", value: 10, color: "bg-amber-500" },
];
const temperatureReadings = [
  { label: "Nozzle", value: "210°C", detail: "Target temperature" },
  { label: "Bed", value: "60°C", detail: "Target temperature" },
];

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function TabLayerAnalysisPage() {
  return (
    <DashContContainer
      title="File analysis"
      description="A quick look at print settings, layer quality, and estimated usage. Mock data for preview."
    >
      <GridContainer aria-label="G-code file analysis">
        <GridCard $colSpan={2}>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Printer className="size-4" aria-hidden="true" />
              Print overview
            </CardDescription>
            <CardTitle className="text-xl">benchy_sample.gcode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Metric label="Total layers" value="248" />
              <Metric label="Print time" value="3h 42m" />
              <Metric label="Filament" value="12.8 g" />
              <Metric label="Nozzle" value="0.4 mm" />
            </div>
          </CardContent>
        </GridCard>

        <GridCard>
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

        <GridCard>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Weight className="size-4" aria-hidden="true" />
              Material usage
            </CardDescription>
            <CardTitle>12.8 g</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[64%] rounded-full bg-primary" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Approx. 4.3 m</span>
              <span>of 20 g spool</span>
            </div>
          </CardContent>
        </GridCard>

        <GridCard $colSpan={2}>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Activity className="size-4" aria-hidden="true" />
              Movement breakdown
            </CardDescription>
            <CardTitle>1,842 m total path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {movementBreakdown.map((movement) => (
              <div key={movement.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{movement.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {movement.value}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${movement.color}`}
                    style={{ width: `${movement.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </GridCard>

        <GridCard>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Thermometer className="size-4" aria-hidden="true" />
              Temperature targets
            </CardDescription>
            <CardTitle>PLA profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {temperatureReadings.map((reading) => (
              <div
                key={reading.label}
                className="flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium">{reading.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {reading.detail}
                  </p>
                </div>
                <span className="text-lg font-semibold tabular-nums">
                  {reading.value}
                </span>
              </div>
            ))}
          </CardContent>
        </GridCard>

        <GridCard>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Clock3 className="size-4" aria-hidden="true" />
              Time estimate
            </CardDescription>
            <CardTitle>3h 42m</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Printing</span>
              <span>3h 18m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Travel &amp; waits</span>
              <span>24m</span>
            </div>
          </CardContent>
        </GridCard>

        <GridCard $colSpan={2}>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <ShieldCheck className="size-4" aria-hidden="true" />
              File checks
            </CardDescription>
            <CardTitle>Looks ready to print</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="size-4 text-emerald-600"
                aria-hidden="true"
              />
              Start sequence found
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="size-4 text-emerald-600"
                aria-hidden="true"
              />
              End sequence found
            </div>
            <div className="flex items-center gap-2">
              <Waves
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              No unusual travel spikes
            </div>
          </CardContent>
        </GridCard>
      </GridContainer>
    </DashContContainer>
  );
}
