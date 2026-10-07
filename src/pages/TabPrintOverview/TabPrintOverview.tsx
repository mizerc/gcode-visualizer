import {
  Activity,
  Clock3,
  ShieldCheck,
  Thermometer,
  Waves,
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
import { CardInfo1 } from "./CardInfo1";
import { GridCardBb } from "@/components/grid/GridCardBb";
import { IconWeight } from "@tabler/icons-react";

export function TabPrintOverview() {
  // CHART DATA
  const movementBreakdown = [
    { label: "Print moves", value: 68, color: "bg-primary" },
    { label: "Travel moves", value: 22, color: "bg-sky-500" },
    { label: "Retractions", value: 10, color: "bg-amber-500" },
  ];

  // TEMPERATURE READINGS DATA
  const temperatureReadings = [
    { label: "Nozzle", value: "210°C", detail: "Target temperature" },
    { label: "Bed", value: "60°C", detail: "Target temperature" },
  ];

  return (
    <DashContContainer
      title="Command Analysis"
      description="Analysis of the G-code commands for the current print."
    >
      <GridContainer aria-label="G-code file analysis">
        <CardInfo1 />

        {/* <CardInfo2 /> */}

        <GridCardBb
          title="MATERIAL USAGE"
          value="4.3 m / 20 g"
          TheIcon={IconWeight}
        >
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[64%] rounded-full bg-primary" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Approx. 4.3 m</span>
            <span>of 20 g spool</span>
          </div>
        </GridCardBb>

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
