import DashContContainer from "@/components/gui/DashContContainer";
import TextArea from "../components/gui/TextArea";
import { useApp } from "@/context/AppContext";
import VList from "@/components/guiv2/VList";

export function TabViewFileFast() {
  const { gcodeText } = useApp();
  return (
    <DashContContainer title="File Content">
      {gcodeText && (
        <VList>
          {/* <TextArea value={gcodeText} /> */}
          {/* render gcodeText as list items */}
          {gcodeText.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </VList>
      )}
    </DashContContainer>
  );
}
