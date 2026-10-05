import { useCallback, useEffect, useState } from "react";
import AppContainer from "./gui/components/AppContainer";
import { TabContent, TabHeaderContainer } from "./components/tab/TabContainer";
import { TabHeaderButton } from "./components/tab/TabHeaderButton";
import { TabInputPage } from "./pages/TabInputPage";
import { TabLayerPage } from "./pages/TabLayerPag";
import { TabAnalysisPage } from "./pages/TabAnalysisPage";
import { TabVisualizationPage } from "./pages/TabVisualizationPage";
import { useApp } from "./context/AppContext";

function App() {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<
    "input" | "layer" | "analysis" | "visualization"
  >("input");

  const {
    layer,
    setCommand,
    parsedInstance,
    gcodeFile,
    prevLayer,
    nextLayer,
    prevCommand,
    nextCommand,
  } = useApp();

  // REGISTER APP SCOPE LISTENERS
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "ArrowUp") {
        nextLayer();
        setCommand(
          parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
        );
      } else if (event.key === "ArrowDown") {
        prevLayer();
        setCommand(
          parsedInstance.current?.getCommandsCountForLayer(layer) || 0,
        );
      } else if (event.key === "ArrowLeft") {
        prevCommand();
      } else if (event.key === "ArrowRight") {
        nextCommand();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevLayer, nextLayer, prevCommand, nextCommand, layer]);

  // UPDATE COMMANDS COUNT
  useEffect(() => {
    setCommand(parsedInstance.current?.getCommandsCountForLayer(layer) || 0);
  }, [layer]);

  return (
    <AppContainer>
      <h1>GCODE VISUALIZER</h1>
      <p>
        Analyze and visualize your 3D printing G-code files with detailed
        layer-by-layer inspection, movement analysis, and real-time canvas
        rendering.
      </p>

      <TabHeaderContainer>
        <TabHeaderButton
          active={activeTab === "input"}
          onClick={() => setActiveTab("input")}
        >
          File Input
        </TabHeaderButton>
        <TabHeaderButton
          active={activeTab === "layer"}
          onClick={() => setActiveTab("layer")}
          disabled={!gcodeFile}
        >
          Layer Explorer
        </TabHeaderButton>
        <TabHeaderButton
          active={activeTab === "analysis"}
          onClick={() => setActiveTab("analysis")}
          disabled={!gcodeFile}
        >
          Command Analysis
        </TabHeaderButton>
        <TabHeaderButton
          active={activeTab === "visualization"}
          onClick={() => setActiveTab("visualization")}
          disabled={!gcodeFile}
        >
          Visualization
        </TabHeaderButton>
      </TabHeaderContainer>

      {/* TAB PAGINATION */}
      <TabContent>
        {activeTab === "input" && <TabInputPage />}
        {activeTab === "layer" && <TabLayerPage />}
        {activeTab === "analysis" && <TabAnalysisPage />}
        {activeTab === "visualization" && <TabVisualizationPage />}
      </TabContent>
    </AppContainer>
  );
}

export default App;
