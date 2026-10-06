import { TabKeys, type TabKey } from "@/context/AppContext";
import type { Icon } from "@tabler/icons-react";
import {
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconUsers,
} from "@tabler/icons-react";

export interface SidebarMenuItem {
  title: string;
  tabKey: TabKey;
  icon?: Icon;
}

export const sidebarMenu: SidebarMenuItem[] = [
  // file input
  {
    title: "File Input",
    tabKey: TabKeys.FileInputPage,
    icon: IconFileAi,
  },
  // print overview (cards)
  {
    title: "Print Overview",
    tabKey: TabKeys.PrintOverview,
    icon: IconDashboard,
  },
  // layer visualization
  {
    title: "Layer Visualization",
    tabKey: TabKeys.Layer,
    icon: IconInnerShadowTop,
  },

  // viewfilefast
  {
    title: "View File Fast",
    tabKey: TabKeys.ViewFileFast,
    icon: IconFileDescription,
  },
  // view file slow
  {
    title: "View File",
    tabKey: TabKeys.ViewFile,
    icon: IconFileDescription,
  },
  // command analysis (old)
  {
    title: "Command Analysis (Old)",
    tabKey: TabKeys.CommandAnalysisOld,
    icon: IconUsers,
  },
  // About
  {
    title: "About",
    tabKey: TabKeys.About,
    icon: IconHelp,
  },
];
