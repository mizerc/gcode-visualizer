import GcodeCanvas from "../components/core/GcodeCanvas";
import { useApp } from "../context/AppContext";
import DashContContainer from "@/components/gui/DashContContainer";
import { LayerAndCommandPicker } from "@/components/core/LayerAndCommandPicker";

export function LayerRendererPage() {
  const { parsedInstance, layer, command } = useApp();

  // const extrusionTimelineData = parsedInstance.current
  //   ?.getValidXYCommandsForLayer(layer)
  //   .map((cmd) => {
  //     return {
  //       bin: cmd.code,
  //       coount: cmd.extruded_volume_mm3 ? cmd.extruded_volume_mm3 : 1,
  //     };
  //   });

  const renderCanvas = () => {
    if (!parsedInstance.current) {
      return null;
    }

    return (
      <GcodeCanvas
        points={parsedInstance.current.getValidXYCommandsForLayer(
          layer,
          command,
        )}
      />
    );
  };

  return (
    <DashContContainer title="Layer Visualization">
      <LayerAndCommandPicker />

      {/* CANVAS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          padding: "24px",
          borderRadius: "4px",
          border: "2px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        {renderCanvas()}
      </div>
    </DashContContainer>
  );
}
