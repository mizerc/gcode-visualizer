"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "../DashLogo";
import { useApp } from "@/context/AppContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currTab, setTab } = useApp();

  return (
    <Sidebar {...props}>
      {/* HEADER */}
      <SidebarHeader className="p-0">
        <SidebarLogo />
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent>
        {/* SECTION 0 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* ITEM 1 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Input"
                  className="pl-4!"
                  onClick={() => setTab("input")}
                >
                  <IconDashboard />
                  <span>Open</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Input"
                  className="pl-4!"
                  onClick={() => setTab("viewfile")}
                >
                  <IconFileDescription />
                  <span>View File</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="File Info"
                  className="pl-4!"
                  onClick={() => setTab("fileinfo")}
                >
                  <IconFileDescription />
                  <span>File Info</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ITEM 2 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Layer Analysis"
                  className="pl-4!"
                  onClick={() => setTab("analysis")}
                >
                  <IconChartBar />
                  <span>Layer Analysis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ITEM 2 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Analyse"
                  className="pl-4!"
                  onClick={() => setTab("layer")}
                >
                  <IconListDetails />
                  <span>Analyse</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ITEM 2 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Analyse"
                  className="pl-4!"
                  onClick={() => setTab("visualization")}
                >
                  <IconDashboard />
                  <span>Visualize</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* SECTION 1 */}
        {/* <NavMain items={data.navMain} /> */}
        {/* SECTION 2 */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* SECTION 3 */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Quick Create">
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
