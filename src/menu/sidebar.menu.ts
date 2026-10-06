import { TabKeys, type TabKey } from "@/context/AppContext";
import type { Icon } from "@tabler/icons-react";
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
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
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
  // layer analysis old
  {
    title: "Command Analysis (Old)",
    tabKey: TabKeys.CommandAnalysisOld,
    icon: IconUsers,
  },
  // layer analysis new
  {
    title: "Command Analysis (New)",
    tabKey: TabKeys.CommandAnalysisNew,
    icon: IconDashboard,
  },
];
