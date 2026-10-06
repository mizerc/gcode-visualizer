import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// import data from "./data.json";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { TabInputPage } from "./TabInputPage";
import { TabKeys, useApp } from "@/context/AppContext";
import { TabVisualizationPage } from "./TabVisualizationPage";
import TabViewFilePage from "./TabViewFilePage";
import { TabFileInfoPage } from "./TabFileInfoPage";
import { TabLayerPage } from "./TabLayerPag";
import { TabCmdAnalysisOld } from "./TabCmdAnalysisOld/TabCmdAnalysisOld";
import { TabCmdAnalysisNew } from "./TabCmdAnalysisNew/TabCmdAnalysisNew";
import { TabViewFileFast } from "./TabViewFileFast";

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
        <Topbar />

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col">
          {currTab === TabKeys.FileInputPage && <TabInputPage />}

          {currTab === TabKeys.ViewFileFast && <TabViewFileFast />}

          {currTab === TabKeys.ViewFile && <TabViewFilePage />}

          {currTab === TabKeys.FileInfo && <TabFileInfoPage />}

          {currTab === TabKeys.Layer && <TabLayerPage />}

          {currTab === TabKeys.CommandAnalysisOld && <TabCmdAnalysisOld />}

          {currTab === TabKeys.CommandAnalysisNew && <TabCmdAnalysisNew />}

          {currTab === TabKeys.Visualization && <TabVisualizationPage />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
