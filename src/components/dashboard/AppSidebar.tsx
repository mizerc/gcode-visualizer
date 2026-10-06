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
import { SidebarLogo } from "./DashLogo";
import { useApp } from "@/context/AppContext";
import { sidebarMenu } from "@/menu/sidebar.menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTab } = useApp();

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
              {sidebarMenu.map((item) => (
                <SidebarMenuItem key={item.tabKey}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="pl-4!"
                    onClick={() => setTab(item.tabKey)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
