import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import VList from "./components/VList";
import Label from "./components/Label";
import TextArea from "./components/TextArea";
import { ParsedGcode } from "./Parser";
import HList from "./components/HList";
import GcodeCanvas from "./components/GcodeCanvas";
import Grid from "./components/Grid";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const parseInstance = useRef<ParsedGcode | null>(null);
  const [layer, setLayer] = useState(0);
  const [command, setCommand] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
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

        setFile(fakeFile);
        // setFileContent(text);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    handleAsync();
  };

  useEffect(() => {
    if (!file) {
      setFileContent("");
      return;
    }

    file.text().then((content) => {
      parseInstance.current = new ParsedGcode(content);
      setFileContent(content);
      // setFileContent(parsedGcode.toString());
    });
  }, [file]);

  const renderCanvas = () => {
    if (!parseInstance.current) {
      return null;
    }

    return (
      <GcodeCanvas
        points={parseInstance.current.getValidXYCommandsForLayer(
          layer,
          command
        )}
      />
    );
  };

  //
  const prevLayer = useCallback(
    () => setLayer(layer - 1 < 0 ? 0 : layer - 1),
    [layer]
  );
  const nextLayer = useCallback(() => setLayer(layer + 1), [layer]);
  const prevCommand = useCallback(
    () => setCommand(command - 1 < 0 ? 0 : command - 1),
    [command]
  );
  const resetLayer = useCallback(() => setLayer(0), [command]);

  const restCommand = useCallback(() => {
    setCommand(0);
  }, [command, layer]);
  const nextCommand = useCallback(() => {
    const maxCommandValue =
      (parseInstance.current?.getCommandsCountForLayer(layer) || 1) - 1;
    setCommand(command + 1 < maxCommandValue ? command + 1 : maxCommandValue);
  }, [command, layer]);

  // LISTENER
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "ArrowUp") {
        nextLayer();
        setCommand(parseInstance.current?.getCommandsCountForLayer(layer) || 0);
      } else if (event.key === "ArrowDown") {
        prevLayer();
        setCommand(parseInstance.current?.getCommandsCountForLayer(layer) || 0);
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
    setCommand(parseInstance.current?.getCommandsCountForLayer(layer) || 0);
  }, [layer]);

  return (
    <>
      <div className="container">
        <h1>GCODE VISUALIZER</h1>

        <VList>
          <VList>
            <h2>INPUT</h2>
            <HList>
              <input
                style={{
                  border: "1px solid black",
                  padding: 8,
                }}
                type="file"
                onChange={handleFileChange}
              />
              <button onClick={readFromExample}>Read from example</button>
            </HList>
          </VList>

          <VList>
            <h2>BASIC INFO</h2>
            <HList>
              <VList>
                <h3>FILE INFO</h3>
                <Label title="Filename" value={file?.name || ""} />
                <Label title="File size" value={file?.size.toString() || ""} />
                <Label title="File type" value={file?.type || ""} />
                <Label
                  title="File last modified"
                  value={file?.lastModified.toString() || ""}
                />
                <Label
                  title="File last modified"
                  value={file?.lastModified.toString() || ""}
                />
              </VList>

              <VList>
                <h3>FILE CONTENT</h3>
                <TextArea value={fileContent} />
              </VList>
            </HList>
          </VList>

          <h2>PER-LAYER DATA</h2>

          <HList>
            <Label
              title="Layer count"
              value={parseInstance.current?.getLayersCount().toString() || ""}
            />
            <Label title="Current layer" value={layer.toString()} />
            <button onClick={prevLayer}>Prev Layer</button>
            <button onClick={nextLayer}>Next Layer</button>
            <button onClick={resetLayer}>Reset</button>
          </HList>

          <HList>
            <Label
              title="Commands in this layer"
              value={
                parseInstance.current
                  ?.getCommandsCountForLayer(layer)
                  .toString() || ""
              }
            />
            {/* <Label
              title="G1 Commands in this layer"
              value={
                parseInstance.current
                  ?.getCommandCountForLayerAndCode(layer, "G1")
                  .toString() || ""
              }
            /> */}
            <Label title="Current command" value={command.toString()} />
            <button onClick={prevCommand}>Prev command</button>
            <button onClick={nextCommand}>Next command</button>
            <button onClick={restCommand}>Reset</button>
          </HList>

          <VList>
            <h3>COMMANDS OF CURRENT LAYER</h3>
            <TextArea
              value={
                parseInstance.current
                  ?.getCommandsForLayer(layer)
                  .map((command) => {
                    return `line: ${command.line}\nCMD: ${command.code}, X: ${command.x}, Y: ${command.y}, Z: ${command.z}, E: ${command.e}, F: ${command.f}\n`;
                  })
                  .join("\n") || ""
              }
            />
          </VList>

          <Label
            title="Command"
            value={
              parseInstance.current?.getCommand(layer, command)?.line || ""
            }
          />

          <h2>Moviment Analysis</h2>
          <Grid maxCol={3}>
            <Label
              title="CODE"
              value={
                parseInstance.current?.getCommand(layer, command)?.code || ""
              }
              unit=""
            />
            <Label
              title="XYZE"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.x?.toFixed(3) +
                  ", " +
                  parseInstance.current
                    ?.getCommand(layer, command)
                    ?.y?.toFixed(3) +
                  ", " +
                  parseInstance.current
                    ?.getCommand(layer, command)
                    ?.z?.toFixed(3) +
                  ", " +
                  parseInstance.current
                    ?.getCommand(layer, command)
                    ?.e?.toFixed(3) || ""
              }
              unit=""
            />
            <Label
              title="last seen z"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.last_seen_z?.toFixed(3) || ""
              }
              unit="mm"
            />
            <Label
              title="DIST"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.distance?.toFixed(3) || ""
              }
              unit="mm"
            />
            <Label
              title="EXTRUDED"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.extruded_volume_mm3?.toFixed(3) || ""
              }
              unit="mm3"
            />
            <Label
              title="last_f_mm_s"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.last_seen_f_mm_s?.toFixed(3) || ""
              }
              unit="mm/s"
            />
            <Label
              title="EXTRUDED VOLUME PER MM"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.volume_per_distance?.toFixed(3) || ""
              }
              unit="mm3/s"
            />
            <Label
              title="VELOCITY"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.velocity_mm_s?.toFixed(3) || ""
              }
              unit="mm/s"
            />
            <Label
              title="FLOW"
              value={
                parseInstance.current
                  ?.getCommand(layer, command)
                  ?.flow_mm3_s?.toFixed(3) || ""
              }
              unit="mm3/s"
            />
          </Grid>

          <h2>Histogram of Current Layer</h2>
          <div>
            {parseInstance.current
              ?.getHistogramArrayFromLayer(layer)
              .map((str) => {
                return <p>{str}</p>;
              })}
          </div>

          <h2>Extrusion Timeline</h2>
          <BarChart
            width={600}
            height={200}
            data={parseInstance.current
              ?.getValidXYCommandsForLayer(layer)
              .map((cmd) => {
                return {
                  bin: cmd.code,
                  coount: cmd.extruded_volume_mm3 ? cmd.extruded_volume_mm3 : 1,
                };
              })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bin" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          {/* <HistogramCanvas
            commands={
              parseInstance.current?.getValidXYCommandsForLayer(
                layer,
                command
              ) || []
            }
          /> */}

          <h2>Canvas</h2>
          {renderCanvas()}
        </VList>
      </div>
    </>
  );
}

export default App;
