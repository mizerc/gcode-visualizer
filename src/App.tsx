import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import VList from "./components/VList";
import Label from "./components/Label";
import TextArea from "./components/TextArea";
import { ParsedGcode } from "./Parser";
import HList from "./components/HList";
import GcodeCanvas from "./components/GcodeCanvas";
import Grid from "./components/Grid";
import NavigationControl from "./components/NavigationControl";
import Histogram from "./components/Histogram";
import { TabGrid, GridCell } from "./components/TabGrid";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const parseInstance = useRef<ParsedGcode | null>(null);
  const [layer, setLayer] = useState(0);
  const [command, setCommand] = useState(0);
  const [activeTab, setActiveTab] = useState<'input' | 'layer' | 'analysis' | 'visualization'>('input');

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
      // Auto-switch to layer explorer when file is loaded
      setActiveTab('layer');
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
        <p className="app-description">
          Analyze and visualize your 3D printing G-code files with detailed layer-by-layer inspection, 
          movement analysis, and real-time canvas rendering.
        </p>


        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            📁 File Input
          </button>
          <button 
            className={`tab ${activeTab === 'layer' ? 'active' : ''}`}
            onClick={() => setActiveTab('layer')}
            disabled={!file}
          >
            🔍 Layer Explorer
          </button>
          <button 
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
            disabled={!file}
          >
            📊 Command Analysis
          </button>
          <button 
            className={`tab ${activeTab === 'visualization' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualization')}
            disabled={!file}
          >
            🎨 Visualization
          </button>
        </div>

        <div className="tab-content">
          {/* FILE INPUT TAB */}
          {activeTab === 'input' && (
            <>
              <VList>
                <h2>INPUT</h2>
                <HList>
                  <input
                    type="file"
                    onChange={handleFileChange}
                  />
                  <button onClick={readFromExample}>Read from example</button>
                </HList>
              </VList>

              {file ? (
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
                        title="Layer count"
                        value={parseInstance.current?.getLayersCount().toString() || ""}
                      />
                    </VList>

                    <VList>
                      <h3>FILE CONTENT</h3>
                      <TextArea value={fileContent} />
                    </VList>
                  </HList>
                </VList>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#94a3b8',
                  fontSize: '1.1em'
                }}>
                  👆 Please upload a G-code file or load an example to get started
                </div>
              )}
            </>
          )}

          {/* LAYER EXPLORER TAB */}
          {activeTab === 'layer' && (
            <TabGrid>
              {/* Navigation - Full width Row 1 */}
              <GridCell colStart={1} colEnd={5} rowStart={1}>
                <h2>PER-LAYER DATA</h2>
                <NavigationControl
                  layerCount={parseInstance.current?.getLayersCount() || 0}
                  currentLayer={layer}
                  commandsCount={parseInstance.current?.getCommandsCountForLayer(layer) || 0}
                  currentCommand={command}
                  onPrevLayer={prevLayer}
                  onNextLayer={nextLayer}
                  onResetLayer={resetLayer}
                  onPrevCommand={prevCommand}
                  onNextCommand={nextCommand}
                  onResetCommand={restCommand}
                />
              </GridCell>

              {/* Commands of Current Layer - Left 3 columns, Rows 2-3 */}
              <GridCell colStart={1} colEnd={4} rowStart={2} rowEnd={4}>
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
              </GridCell>

              {/* Current Command Info - Right column, Rows 2-3 */}
              <GridCell colStart={4} colEnd={5} rowStart={2} rowEnd={4}>
                <VList>
                  <h3>CURRENT COMMAND</h3>
                  <Label
                    title={`Index ${command}`}
                    value={
                      parseInstance.current?.getCommand(layer, command)?.line || "N/A"
                    }
                  />
                  <Label
                    title="Command Type"
                    value={
                      parseInstance.current?.getCommand(layer, command)?.code || "N/A"
                    }
                  />
                </VList>
              </GridCell>

              {/* Command Distribution - Full width Row 4 */}
              <GridCell colStart={1} colEnd={5} rowStart={4}>
                <h2>Command Distribution</h2>
                <Histogram
                  data={parseInstance.current?.getHistogramArrayFromLayer(layer) || []}
                />
              </GridCell>

              {/* Extrusion Volume Chart - Full width Rows 5-6 */}
              <GridCell colStart={1} colEnd={5} rowStart={5} rowEnd={7}>
                <h2>Extrusion Volume per Command</h2>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  padding: '24px',
                  borderRadius: '4px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  overflowX: 'auto'
                }}>
                  <BarChart
                    width={Math.max(800, (parseInstance.current?.getCommandsCountForLayer(layer) || 0) * 8)}
                    height={300}
                    data={parseInstance.current
                      ?.getValidXYCommandsForLayer(layer, parseInstance.current?.getCommandsCountForLayer(layer) || 0)
                      .map((cmd, index) => {
                        return {
                          index: index,
                          volume: cmd.extruded_volume_mm3 || 0,
                          code: cmd.code,
                        };
                      })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="index" 
                      label={{ value: 'Command Index', position: 'insideBottom', offset: -10, style: { fill: '#64748b', fontWeight: 600 } }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      label={{ value: 'Extrusion Volume (mm³)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontWeight: 600 } }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '2px solid #3b82f6', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                      labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                      formatter={(value: number, name: string) => {
                        if (name === 'volume') return [value.toFixed(3) + ' mm³', 'Extrusion Volume'];
                        return [value, name];
                      }}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </div>
              </GridCell>
            </TabGrid>
          )}

          {/* MOVEMENT ANALYSIS TAB */}
          {activeTab === 'analysis' && (
            <TabGrid>
              {/* Navigation - Full width Row 1 */}
              <GridCell colStart={1} colEnd={5} rowStart={1}>
                <h2>Command Analysis</h2>
                <NavigationControl
                  layerCount={parseInstance.current?.getLayersCount() || 0}
                  currentLayer={layer}
                  commandsCount={parseInstance.current?.getCommandsCountForLayer(layer) || 0}
                  currentCommand={command}
                  onPrevLayer={prevLayer}
                  onNextLayer={nextLayer}
                  onResetLayer={resetLayer}
                  onPrevCommand={prevCommand}
                  onNextCommand={nextCommand}
                  onResetCommand={restCommand}
                />
              </GridCell>

              {/* Current Command - Left 2 columns, Row 2 */}
              <GridCell colStart={1} colEnd={3} rowStart={2}>
                <VList>
                  <h3>Current Command</h3>
                  <Label
                    title="G-Code Line"
                    value={
                      parseInstance.current?.getCommand(layer, command)?.line || "N/A"
                    }
                  />
                  <Label
                    title="Command Type"
                    value={
                      parseInstance.current?.getCommand(layer, command)?.code || "N/A"
                    }
                  />
                </VList>
              </GridCell>

              {/* Position Coordinates - Right 2 columns, Row 2 */}
              <GridCell colStart={3} colEnd={5} rowStart={2}>
                <VList>
                  <h3>Position Coordinates</h3>
                  <Grid maxCol={2}>
                    <Label
                      title="X Position"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.x?.toFixed(3) || "N/A"
                      }
                      unit="mm"
                    />
                    <Label
                      title="Y Position"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.y?.toFixed(3) || "N/A"
                      }
                      unit="mm"
                    />
                    <Label
                      title="Z Position"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.z?.toFixed(3) || "N/A"
                      }
                      unit="mm"
                    />
                    <Label
                      title="E Position"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.e?.toFixed(3) || "N/A"
                      }
                      unit="mm"
                    />
                  </Grid>
                </VList>
              </GridCell>

              {/* Movement Metrics - Left 2 columns, Row 3 */}
              <GridCell colStart={1} colEnd={3} rowStart={3}>
                <VList>
                  <h3>Movement Metrics</h3>
                  <Grid maxCol={2}>
                    <Label
                      title="Travel Distance"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.distance?.toFixed(3) || "0.000"
                      }
                      unit="mm"
                    />
                    <Label
                      title="Last Seen Z"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.last_seen_z?.toFixed(3) || "N/A"
                      }
                      unit="mm"
                    />
                  </Grid>
                </VList>
              </GridCell>

              {/* Extrusion Data - Right 2 columns, Row 3 */}
              <GridCell colStart={3} colEnd={5} rowStart={3}>
                <VList>
                  <h3>Extrusion Data</h3>
                  <Grid maxCol={2}>
                    <Label
                      title="Extruded Volume"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.extruded_volume_mm3?.toFixed(3) || "0.000"
                      }
                      unit="mm³"
                    />
                    <Label
                      title="Volume per Distance"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.volume_per_distance?.toFixed(3) || "0.000"
                      }
                      unit="mm³/mm"
                    />
                  </Grid>
                </VList>
              </GridCell>

              {/* Speed & Flow - Full width Row 4 */}
              <GridCell colStart={1} colEnd={5} rowStart={4}>
                <VList>
                  <h3>Speed & Flow</h3>
                  <Grid maxCol={3}>
                    <Label
                      title="Velocity"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.velocity_mm_s?.toFixed(3) || "0.000"
                      }
                      unit="mm/s"
                    />
                    <Label
                      title="Feed Rate"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.last_seen_f_mm_s?.toFixed(3) || "N/A"
                      }
                      unit="mm/s"
                    />
                    <Label
                      title="Flow Rate"
                      value={
                        parseInstance.current
                          ?.getCommand(layer, command)
                          ?.flow_mm3_s?.toFixed(3) || "0.000"
                      }
                      unit="mm³/s"
                    />
                  </Grid>
                </VList>
              </GridCell>
            </TabGrid>
          )}

          {/* VISUALIZATION TAB */}
          {activeTab === 'visualization' && (
            <TabGrid>
              {/* Navigation - Full width Row 1 */}
              <GridCell colStart={1} colEnd={5} rowStart={1}>
                <NavigationControl
                  layerCount={parseInstance.current?.getLayersCount() || 0}
                  currentLayer={layer}
                  commandsCount={parseInstance.current?.getCommandsCountForLayer(layer) || 0}
                  currentCommand={command}
                  onPrevLayer={prevLayer}
                  onNextLayer={nextLayer}
                  onResetLayer={resetLayer}
                  onPrevCommand={prevCommand}
                  onNextCommand={nextCommand}
                  onResetCommand={restCommand}
                />
              </GridCell>

              {/* Canvas Visualization - Full width Rows 2-4 */}
              <GridCell colStart={1} colEnd={5} rowStart={2} rowEnd={5}>
                <h2>Canvas Visualization</h2>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  padding: '24px',
                  borderRadius: '4px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}>
                  {renderCanvas()}
                </div>
              </GridCell>

              {/* Extrusion Timeline - Full width Rows 5-6 */}
              <GridCell colStart={1} colEnd={5} rowStart={5} rowEnd={7}>
                <h2>Extrusion Timeline</h2>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  padding: '24px',
                  borderRadius: '4px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}>
                  <BarChart
                    width={800}
                    height={300}
                    data={parseInstance.current
                      ?.getValidXYCommandsForLayer(layer)
                      .map((cmd) => {
                        return {
                          bin: cmd.code,
                          coount: cmd.extruded_volume_mm3 ? cmd.extruded_volume_mm3 : 1,
                        };
                      })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="bin"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '2px solid #3b82f6', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#colorGradient2)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </div>
              </GridCell>
            </TabGrid>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
