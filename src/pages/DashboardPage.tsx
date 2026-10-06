import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// import data from "./data.json";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useHashNav, TabKeys, TabsByKey } from "@/context/HashNavContext.tsx";

export default function DashboardPage() {
  const { currTab } = useHashNav();
  const CurrentPage = (TabsByKey[currTab] ?? TabKeys.FileInputPage).comp;

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
          <CurrentPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
