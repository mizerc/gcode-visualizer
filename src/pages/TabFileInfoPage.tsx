import { useApp } from "@/context/AppContext";
import FieldTable, { type FieldRow } from "@/components/gui/FieldTable";
import DashContContainer from "@/components/gui/DashContContainer";
import DashSection from "@/components/gui/DashSection";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]} (${bytes.toLocaleString()} bytes)`;
}

export function TabFileInfoPage() {
  const { gcodeFile, parsedInstance } = useApp();

  if (!gcodeFile) {
    return (
      <DashContContainer title="File Info" className="text-muted-foreground">
        No file loaded. Select a G-code file in the Input tab.
      </DashContContainer>
    );
  }

  const generalRows: FieldRow[] = [
    { label: "Name", value: gcodeFile.name },
    { label: "Size", value: formatSize(gcodeFile.size) },
    { label: "Type", value: gcodeFile.type || "unknown" },
    {
      label: "Last modified",
      value: new Date(gcodeFile.lastModified).toLocaleString(),
    },
  ];

  const gcodeRows: FieldRow[] = [
    {
      label: "# Layers",
      value: parsedInstance.current?.getLayersCount().toString(),
    },
  ];

  return (
    <DashContContainer
      title="File Info"
      description="Details about the loaded G-code file."
    >
      <DashSection title="General">
        <FieldTable rows={generalRows} />
      </DashSection>
      {/* Title 2 */}
      <DashSection title="PARSED GCODE">
        <FieldTable rows={gcodeRows} />
      </DashSection>
    </DashContContainer>
  );
}
