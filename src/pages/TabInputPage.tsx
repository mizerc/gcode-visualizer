import { Heading3 } from "../components/gui/Heading3";
import VList from "../components/VList";
import Button from "../gui/components/Button";
import FileInput from "../gui/components/FileInput";
import Label from "../components/Label";
import TextArea from "../components/gui/TextArea";
import { useApp } from "../context/AppContext";

export function TabInputPage() {
  const { setGcodeFile, gcodeFile, parsedInstance, gcodeText } = useApp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGcodeFile(file);
    }
  };

  const readFromExample = () => {
    async function handleAsync() {
      try {
        const response = await fetch("/gcode-visualizer/rabbit.gcode");
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }
        const text = await response.text();
        const fakeFile = new File([text], "rabbit.gcode", {
          type: "text/plain",
        });
        setGcodeFile(fakeFile);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    handleAsync();
  };

  return (
    <>
      <VList>
        <Heading3>INPUT</Heading3>
        <VList>
          {/* <input type="file" onChange={handleFileChange} /> */}
          <FileInput onChange={handleFileChange} accept=".gcode" />
          <Button onClick={readFromExample}>Read from example</Button>
        </VList>
      </VList>

      {gcodeFile ? (
        <VList>
          <Heading3>BASIC INFO</Heading3>
          <VList>
            <Heading3>FILE INFO</Heading3>
            <Label title="Filename" value={gcodeFile?.name || ""} />
            <Label title="File size" value={gcodeFile?.size.toString() || ""} />
            <Label title="File type" value={gcodeFile?.type || ""} />
            <Label
              title="File last modified"
              value={gcodeFile?.lastModified.toString() || ""}
            />
            <Label
              title="Layer count"
              value={parsedInstance.current?.getLayersCount().toString() || ""}
            />

            {gcodeText && (
              <VList>
                <Heading3>FILE CONTENT</Heading3>
                <TextArea value={gcodeText} />
              </VList>
            )}
          </VList>
        </VList>
      ) : (
        <p>Upload a G-code file or load an example to get started</p>
      )}
    </>
  );
}
