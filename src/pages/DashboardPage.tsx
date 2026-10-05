import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// import data from "./data.json";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { TabInputPage } from "./TabInputPage";
import { useApp } from "@/context/AppContext";
import { TabLayerPage } from "./TabLayerPag";
import { TabAnalysisPage } from "./TabAnalysisPage";
import { TabVisualizationPage } from "./TabVisualizationPage";

export default function DashboardPage() {
  const { currTab } = useApp();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* SIDEBAR */}
      <AppSidebar />

      {/* CONTENT */}
      <SidebarInset>
        {/* MAIN TOPBAR */}
        <SiteHeader />

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <p>{currTab}</p>
              {currTab === "input" && <TabInputPage />}
              {currTab === "layer" && <TabLayerPage />}
              {currTab === "analysis" && <TabAnalysisPage />}
              {currTab === "visualization" && <TabVisualizationPage />}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
