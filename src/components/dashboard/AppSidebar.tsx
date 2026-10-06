import * as React from "react";
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
import { TabKeys, useHashNav } from "@/context/HashNavContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currTab, setTab } = useHashNav();

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
              {Object.values(TabKeys).map((tab) => (
                <SidebarMenuItem key={tab.key}>
                  <SidebarMenuButton
                    tooltip={tab.label}
                    className="pl-4! cursor-pointer data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:font-semibold"
                    isActive={currTab === tab.key}
                    onClick={() => setTab(tab.key)}
                  >
                    <span>{tab.label}</span>
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
      <SidebarFooter className="border-t border-muted-foreground/20">
        {/* Create a centralized text Mauricio Ize bold text, h3 size, height around 120px */}
        <div className="flex items-center justify-center h-[80px]">
          <h3 className="text-h3">Mauricio Ize</h3>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
