import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "../components/core/LayerAndCommandPicker";
import { useMemo } from "react";
import { PrettyTextView } from "@/components/core/PrettyTextView";

export function LayerContentPrettyPage() {
  const { parsedInstance, layer, command } = useApp();

  const layerContent = useMemo(() => {
    return (parsedInstance.current?.getCommandsForLayer(layer) || [])
      .map((command) => {
        return `line: ${command.line}\nCMD: ${command.code}, X: ${command.x}, Y: ${command.y}, Z: ${command.z}, E: ${command.e}, F: ${command.f}\n`;
      })
      .join("\n");
  }, [parsedInstance, layer]);

  return (
    <DashContContainer
      title="Per-Layer Content View"
      description="Isolate the content of each layer"
    >
      <LayerAndCommandPicker hiddeCommand />

      {/* RAW TEXT VIEW */}
      {/* <GridCell colStart={1} colEnd={4} rowStart={1} rowEnd={2}>
        <VList>
          <TextArea
            value={
              parsedInstance.current
                ?.getCommandsForLayer(layer)
                .map((command) => {
                  return `line: ${command.line}\nCMD: ${command.code}, X: ${command.x}, Y: ${command.y}, Z: ${command.z}, E: ${command.e}, F: ${command.f}\n`;
                })
                .join("\n") || ""
            }
          />
        </VList>
      </GridCell> */}

      {/* PRETTY TEXT VIEW */}
      {layerContent && <PrettyTextView rawText={layerContent} />}
    </DashContContainer>
  );
}
