import { TabAboutPage } from "@/pages/TabAboutPage";
import { TabCmdAnalysisOld } from "@/pages/TabCmdAnalysisOld/TabCmdAnalysisOld";
import { TabFileInfoPage } from "@/pages/TabFileInfoPage";
import { TabInputPage } from "@/pages/TabInputPage";
import { LayerContentPrettyPage } from "@/pages/LayerContentPrettyPage";
import { TabPrintOverview } from "@/pages/TabPrintOverview/TabPrintOverview";
import { TabVisualizationPage } from "@/pages/TabVisualizationPage";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  type ComponentType,
} from "react";
import type { Icon } from "@tabler/icons-react";
import {
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconUsers,
} from "@tabler/icons-react";
import { LayerAnalysisPage } from "@/pages/LayerAnalysisPage";
import { FileViewPrettyPage } from "@/pages/FileViewPrettyPage";
import { FileViewRawPage } from "@/pages/FileViewRawPage";

// Definition of a tab in the application
type TabDef = { key: string; label: string; comp: ComponentType; icon?: Icon };

// Sidebar menu + pages in one place
export const TabKeys = {
  FileInputPage: {
    key: "input",
    label: "Select G-code File",
    comp: TabInputPage,
    icon: IconFileAi,
  },
  PrintOverview: {
    key: "print-overview",
    label: "Print Overview",
    comp: TabPrintOverview,
    icon: IconDashboard,
  },
  FileInfo: {
    key: "fileinfo",
    label: "File Info",
    comp: TabFileInfoPage,
    icon: IconFileDescription,
  },
  LayerContent: {
    key: "layercontent",
    label: "Per-Layer File Content",
    comp: LayerContentPrettyPage,
    icon: IconInnerShadowTop,
  },
  LayerAnalysis: {
    key: "layeranalysis",
    label: "Per-Layer Analysis",
    comp: LayerAnalysisPage,
    icon: IconInnerShadowTop,
  },
  CommandAnalysisOld: {
    key: "command-analysis-old",
    label: "Per-Command Analysis",
    comp: TabCmdAnalysisOld,
    icon: IconUsers,
  },
  Visualization: {
    key: "visualization",
    label: "Layer Visualization",
    comp: TabVisualizationPage,
    icon: IconInnerShadowTop,
  },
  ViewFile: {
    key: "viewfile",
    label: "View File Pretty",
    comp: FileViewPrettyPage,
    icon: IconFileDescription,
  },
  ViewFileFast: {
    key: "viewfilefast",
    label: "View File Raw",
    comp: FileViewRawPage,
    icon: IconFileDescription,
  },
  About: { key: "about", label: "About", comp: TabAboutPage, icon: IconHelp },
} as const satisfies Record<string, TabDef>;

// Type representing the key of a tab
export type TabKey = (typeof TabKeys)[keyof typeof TabKeys]["key"];

// Lookup by key string (built once, module level)
type TabByKey = {
  [Tab in (typeof TabKeys)[keyof typeof TabKeys] as Tab["key"]]: Tab;
};

export const TabsByKey = Object.fromEntries(
  Object.values(TabKeys).map((tab) => [tab.key, tab]),
) as TabByKey satisfies Record<TabKey, TabDef>;

interface AppContextValue {
  currTab: TabKey;
  setTab: (tab: TabKey) => void;
}

// Not exported: nobody should use this directly
const HashNavContext = createContext<AppContextValue | null>(null);

export function HashNavProvider({ children }: { children: ReactNode }) {
  const [currTab, setCurrTab] = useState<TabKey>("input");

  const setTab = useCallback((tab: TabKey) => {
    console.log(`Switching to tab: ${tab}`);
    setCurrTab(tab);
  }, []);

  const value = useMemo(
    () => ({
      currTab,
      setTab,
    }),
    [currTab, setTab],
  );

  return (
    <HashNavContext.Provider value={value}>{children}</HashNavContext.Provider>
  );
}

export function useHashNav() {
  const ctx = useContext(HashNavContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
