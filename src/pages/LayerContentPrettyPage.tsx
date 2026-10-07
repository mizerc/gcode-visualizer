import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "../components/core/LayerAndCommandPicker";
import { useMemo } from "react";
import { PrettyTextView } from "@/components/core/PrettyTextView";

export function LayerContentPrettyPage() {
  const { parsedInstance, layer } = useApp();

  const layerContent = useMemo(() => {
    return (parsedInstance.current?.getCommandsForLayer(layer) || [])
      .map((command) => {
        return `line: ${command.line}\nCMD: ${command.code}, X: ${command.x}, Y: ${command.y}, Z: ${command.z}, E: ${command.e}, F: ${command.feedrate_mm_min}\n`;
      })
      .join("\n");
  }, [parsedInstance, layer]);

  return (
    <DashContContainer
      title="Per-Layer Content View"
      description="Isolate the content of each layer"
    >
      <LayerAndCommandPicker hiddeCommand />

      {layerContent && <PrettyTextView rawText={layerContent} />}
    </DashContContainer>
  );
}
