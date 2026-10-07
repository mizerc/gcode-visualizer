import type { IParser } from "./IParser";
import { Vec2 } from "./Vec2";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Optional constructor input. Anything omitted falls back to G-code metadata, then defaults. */
export interface ParserOptions {
  fileName?: string;
  nozzleDiameterMm?: number; // default: slicer comment, else 0.4
  filamentDiameterMm?: number; // default: 1.75
  filamentDensityGPerCm3?: number; // default: 1.24 (PLA)
  accelerationMmS2?: number; // default: 0 = ignore acceleration in time estimate
}

export interface Command {
  // Raw line from the G-code file
  line: string;

  // G-code command code (e.g., "G1", "M104")
  code?: string;

  // Parameters for the G-code command (e.g., X, Y, Z, F, E, S)
  x?: number;
  y?: number;
  z?: number; // Z parameter (height)

  // Feedrate is the velocity of nozzle moviment in xyz or velocity of extrusion in E axis.
  feedrate_mm_min?: number; // F parameter (feedrate) in mm/min
  e?: number; // E parameter (extrusion)
  s?: number; // S parameter (temperature, fan speed, dwell seconds)

  // State as last seen for the respective parameters
  last_seen_f_mm_s?: number;
  last_seen_z?: number; // Last seen Z position

  distance?: number; // Distance traveled for this command
  extruded_volume_mm3?: number; // Volume of filament extruded for this command
  weight_g?: number; // Weight of filament used for this command
  volume_per_distance?: number; // Volume of filament per unit distance for this command

  // time
  duration_s?: number; // Duration of this command in seconds
  velocity_mm_s?: number; // Velocity of the print head in mm/s
  acceleration_mm_s2?: number; // Acceleration of the print head in mm/s²
  flow_mm3_s?: number; // Flow rate of filament in mm³ per second
}

export interface PrinterSnapshot {
  hotend_c: number;
  bed_c: number;
  fan_pwm: number; // 0-255
}

export interface TemperatureChange {
  commandIndex: number; // index inside the layer's command list
  target: "hotend" | "bed";
  value_c: number;
  wait: boolean; // M109/M190 block until reached
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface LayerStats {
  time_s: number;
  distance_mm: number;
  volume_mm3: number;
  weight_g: number;
}

interface Layer {
  z: number;
  commands: Command[];
  startState: PrinterSnapshot;
  endState: PrinterSnapshot;
  temperatureChanges: TemperatureChange[];
  stats: LayerStats;
}

interface Position {
  x: number;
  y: number;
  z: number;
  e: number;
}

interface MachineState extends Position {
  f: number; // mm/min, as written in G-code
  relativeXYZ: boolean; // G90 / G91
  relativeE: boolean; // M82 / M83
  hotend_c: number;
  bed_c: number;
  fan_pwm: number;
}

const DEFAULT_NOZZLE_MM = 0.4;
const DEFAULT_FILAMENT_DIAMETER_MM = 1.75;
const DEFAULT_DENSITY_G_CM3 = 1.24;

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

export class ParserV2 implements IParser {
  // List of parsed layers in the G-code file, each representing a Z height
  layers: Layer[] = [];

  // Parser options provided by the user
  private readonly options: ParserOptions;
  private readonly filamentDiameterMm: number;
  private readonly densityGPerMm3: number;
  private readonly metadata = new Map<string, string>();

  // FIXME: Acceleration not supported yet
  // private readonly accelerationMmS2: number;

  // Current machine state during parsing, changes as G-code commands are executed
  private state: MachineState = {
    x: 0,
    y: 0,
    z: 0,
    e: 0,
    f: 0,
    relativeXYZ: false,
    relativeE: false,
    hotend_c: 0,
    bed_c: 0,
    fan_pwm: 0,
  };

  // Accumulated totals for all layers, updated as commands are executed
  private totals: LayerStats = {
    // Total print time
    time_s: 0,
    // Total distance traveled by the print head
    distance_mm: 0,
    // Total volume of filament used
    volume_mm3: 0,
    // Total weight of filament used, depends on the filament density
    weight_g: 0,
  };

  constructor(gcodeFileContent: string, options: ParserOptions = {}) {
    this.options = options;

    this.filamentDiameterMm =
      options.filamentDiameterMm ?? DEFAULT_FILAMENT_DIAMETER_MM;

    // g/cm³ -> g/mm³
    this.densityGPerMm3 =
      (options.filamentDensityGPerCm3 ?? DEFAULT_DENSITY_G_CM3) / 1000;

    // this.accelerationMmS2 = options.accelerationMmS2 ?? 0;

    // Automatically start parsing the G-code content upon instantiation
    this.parse(gcodeFileContent);
  }

  // -------------------------------------------------------------------------
  // Parsing pipeline: tokenize -> detect layer -> execute (update state + stats)
  // -------------------------------------------------------------------------

  private parse(content: string): void {
    let currentZ = 0;
    let currentLayer = this.newLayer(currentZ);

    for (const raw of content.split("\n")) {
      const line = raw.trim();
      if (line.length === 0) continue;

      const cmd: Command = { line };

      // Whole-line comment
      if (line.startsWith(";")) {
        cmd.code = "COMMENT";
        this.readMetadata(line);
        currentLayer.commands.push(cmd);
        continue;
      }

      this.fillCommand(cmd, line);

      // G0/G1 that changes Z starts a new layer
      if ((cmd.code === "G1" || cmd.code === "G0") && cmd.z !== undefined) {
        const target = this.resolveTarget(cmd);
        if (target.z !== currentZ) {
          currentZ = target.z;
          this.finishLayer(currentLayer);
          if (currentLayer.commands.length) this.layers.push(currentLayer);
          currentLayer = this.newLayer(currentZ);
        }
      }

      this.execute(cmd, currentLayer);

      cmd.last_seen_f_mm_s = this.state.f / 60; // mm/min to mm/s
      cmd.last_seen_z = this.state.z;

      currentLayer.commands.push(cmd);
    }

    this.finishLayer(currentLayer);
    if (currentLayer.commands.length) this.layers.push(currentLayer);
  }

  /** "G1 X10.3 Y10 E1 ; comment" -> cmd.code / x / y / e ... (inline comments are stripped) */
  private fillCommand(cmd: Command, line: string): void {
    const semi = line.indexOf(";");
    const body = (semi === -1 ? line : line.slice(0, semi)).trim();

    const params = new Map<string, number>();
    // body.split(/\s+/) split the line into individual parts (e.g., "G1", "X10.3", "Y10", "E1")
    for (const part of body.split(/\s+/)) {
      if (!part) continue;

      // Extract the letter and numeric value from the part (e.g., "X10.3" -> letter="X", value=10.3)
      const letter = part.charAt(0).toUpperCase();
      const value = parseFloat(part.slice(1));

      // Skip parts that do not have a valid numeric value
      if (Number.isNaN(value)) continue;

      // Assign the command code if it's a G or M command and hasn't been set yet
      if ((letter === "G" || letter === "M") && cmd.code === undefined) {
        cmd.code = letter + value;
      } else {
        params.set(letter, value);
      }
    }

    // Assign the parsed parameters to the command object (x, y, z, e, f, s)
    const assign = (
      key: "x" | "y" | "z" | "e" | "feedrate_mm_min" | "s",
      letter: string,
    ) => {
      const v = params.get(letter);
      if (v !== undefined) cmd[key] = v;
    };
    assign("x", "X");
    assign("y", "Y");
    assign("z", "Z");
    assign("e", "E");
    assign("feedrate_mm_min", "F");
    assign("s", "S");

    // P is used by G4 (dwell, milliseconds); stash it in s as seconds if S absent
    if (cmd.code === "G4" && cmd.s === undefined && params.has("P")) {
      cmd.s = (params.get("P") as number) / 1000;
    }
  }

  /** One handler per code. To support a new command, add a case here. */
  private execute(cmd: Command, layer: Layer): void {
    const s = this.state;

    switch (cmd.code) {
      case "G0":
      case "G1":
        this.executeMove(cmd, layer);
        break;

      // The dwell command (G4) pauses the printer for a specified duration
      case "G4":
        this.addTime(layer, cmd.s ?? 0);
        if (cmd.s) cmd.duration_s = cmd.s;
        break;

      // home (approximation: all axes to 0)
      case "G28":
        s.x = 0;
        s.y = 0;
        s.z = 0;
        break;

      // relative positioning
      case "G90":
        s.relativeXYZ = false;
        break;
      case "G91":
        s.relativeXYZ = true;
        break;

      // extruder relative positioning
      case "M82":
        s.relativeE = false;
        break;
      case "M83":
        s.relativeE = true;
        break;

      // set position (G92)
      case "G92": {
        // set position; no axes given = reset all to 0
        const none =
          cmd.x === undefined &&
          cmd.y === undefined &&
          cmd.z === undefined &&
          cmd.e === undefined;
        if (cmd.x !== undefined || none) s.x = cmd.x ?? 0;
        if (cmd.y !== undefined || none) s.y = cmd.y ?? 0;
        if (cmd.z !== undefined || none) s.z = cmd.z ?? 0;
        if (cmd.e !== undefined || none) s.e = cmd.e ?? 0;
        break;
      }

      // hotend temperature commands (M104, M109)
      case "M104": // hotend, no wait
      case "M109": // hotend, wait
        if (cmd.s !== undefined) {
          s.hotend_c = cmd.s;
          this.recordTemperature(layer, "hotend", cmd.s, cmd.code === "M109");
        }
        break;

      // bed temperature commands (M140, M190)
      case "M140": // bed, no wait
      case "M190": // bed, wait
        if (cmd.s !== undefined) {
          s.bed_c = cmd.s;
          this.recordTemperature(layer, "bed", cmd.s, cmd.code === "M190");
        }
        break;

      // fan control commands (M106, M107)
      case "M106": // fan on (defaults to full speed)
        s.fan_pwm = cmd.s ?? 255;
        break;
      case "M107": // fan off
        s.fan_pwm = 0;
        break;

      default:
        break;
    }
  }

  /**
   * The most common command in G-code!
   * Moviment the nozzle to the specified position,
   * taking into account relative and absolute positioning.
   */
  private executeMove(cmd: Command, layer: Layer): void {
    // NOTE: s is a reference to the current state!
    // So any changes made to s will directly affect the current state.
    const s = this.state;

    // Store the previous position before calculating the target position.
    const prev: Position = { x: s.x, y: s.y, z: s.z, e: s.e };

    // Calculate the target position based on the current command and positioning mode.
    const target = this.resolveTarget(cmd);

    // If command has a new feedrate/velocity, update the current state.
    if (cmd.feedrate_mm_min !== undefined) {
      s.f = cmd.feedrate_mm_min;
    }

    // Convert the feed rate from mm/min to mm/s.
    const feed_mm_s = s.f / 60;

    // extruded amount in mm of filament
    const extruded_filament_len_mm = target.e - prev.e;

    // Compute the 3D travel distance of the move.
    // Aka, the distance from current state to the target where the command wants the nozzle to go.
    // hypot = sqrt(dx^2 + dy^2 + dz^2) = hipotenuse = len of the 3D travel vector
    const travel_dist_3d_mm = Math.hypot(
      target.x - prev.x,
      target.y - prev.y,
      target.z - prev.z,
    );

    /**
     * Travel from xyz to xyz' takes some time.
     * Pulling material through the nozzle also takes time.
     * The timed distance is used to estimate the duration of the move.
     * So it takes in account both the travel distance if present,
     * Or just the time to pull material with the nozzle stationary (without xyz movement).
     */
    const timedDistance =
      travel_dist_3d_mm > 0
        ? travel_dist_3d_mm
        : Math.abs(extruded_filament_len_mm);

    // Compute estimated duration of the move based on the timed distance and feedrate/velocity.
    const duration_sec = this.moveDuration(timedDistance, feed_mm_s);
    if (duration_sec > 0) {
      // Store the duration in the command for later reference.
      cmd.duration_s = duration_sec;

      // Record the estimated duration of this move in the layer and total time.
      this.addTime(layer, duration_sec);
    }

    // Distance / extrusion (only XY moves that carry an E word)
    if ((cmd.x !== undefined || cmd.y !== undefined) && cmd.e !== undefined) {
      // Compute the XY distance of the move on the same Z (same plane, same layer).
      const distance_mm = new Vec2(target.x, target.y).distanceTo(
        new Vec2(prev.x, prev.y),
      );

      // Compute volume of plastic filament used
      const radius = this.filamentDiameterMm / 2; // radius of the filament in mm
      const filamentVolumeMM3 =
        Math.PI * radius * radius * extruded_filament_len_mm; // mm³
      const weight = filamentVolumeMM3 * this.densityGPerMm3; // grams

      // Update the command with the computed values.
      cmd.distance = distance_mm;
      cmd.extruded_volume_mm3 = filamentVolumeMM3;
      cmd.weight_g = weight;

      // Update the volume of filament per distance
      if (distance_mm > 0)
        cmd.volume_per_distance = filamentVolumeMM3 / distance_mm;

      // Update the speed/velocity
      if (feed_mm_s > 0) {
        cmd.velocity_mm_s = feed_mm_s;

        // Update the flow rate, aka volume of material extruded per time unit
        if (duration_sec > 0) cmd.flow_mm3_s = filamentVolumeMM3 / duration_sec;
      }

      // Only count forward extrusion so wipes/retractions don't cancel real usage
      if (extruded_filament_len_mm > 0) {
        layer.stats.distance_mm += distance_mm;
        layer.stats.volume_mm3 += filamentVolumeMM3;
        layer.stats.weight_g += weight;

        this.totals.distance_mm += distance_mm;
        this.totals.volume_mm3 += filamentVolumeMM3;
        this.totals.weight_g += weight;
      }
    }

    // Update the state to reflect the new target position.
    // Aka, simulate the printer head finished the moviment to the new target position.
    s.x = target.x;
    s.y = target.y;
    s.z = target.z;
    s.e = target.e;
  }

  /** Where this G0/G1 ends up, honouring G90/G91 and M82/M83. Does not mutate state. */
  private resolveTarget(cmd: Command): Position {
    // Save the current state for reference when calculating the target position.
    const s = this.state;

    // Helper function to resolve the target position for a single axis, considering relative or absolute positioning.
    const axis = (
      current: number,
      value: number | undefined,
      isRelativeModeEnabled: boolean,
    ) => {
      /**
       * The command to move the print contains the new target position for the specified axis.
       * value variable holds the target position for the specified axis.
       * Absolute: a position in the bed coordinate system. Like 100,110;
       * Relative: an offset from the current position. Like +10,+5;
       */
      if (value === undefined) return current;

      if (isRelativeModeEnabled) {
        return current + value;
      }

      // If not in relative mode, the value is treated as an absolute position.
      return value;
    };
    return {
      x: axis(s.x, cmd.x, s.relativeXYZ),
      y: axis(s.y, cmd.y, s.relativeXYZ),
      z: axis(s.z, cmd.z, s.relativeXYZ),
      e: axis(s.e, cmd.e, s.relativeE),
    };
  }

  /**
   * Constant-speed time
   * (trapezoidal profile if an acceleration is present is not supported yet)
   */
  private moveDuration(distance_mm: number, feed_mm_s: number): number {
    // Validate
    if (distance_mm <= 0 || feed_mm_s <= 0) {
      return 0;
    }
    // duration = distance / velocity
    return distance_mm / feed_mm_s;

    // const a = this.accelerationMmS2;
    // if (!a) return distance / feed_mm_s;

    // Acceleration-based trapezoidal profile (not used currently)
    // const rampDistance = (feed_mm_s * feed_mm_s) / a; // accel + decel
    // return distance >= rampDistance
    //   ? distance / feed_mm_s + feed_mm_s / a
    //   : 2 * Math.sqrt(distance / a);
  }

  // -------------------------------------------------------------------------
  // Small helpers
  // -------------------------------------------------------------------------

  private snapshot(): PrinterSnapshot {
    return {
      hotend_c: this.state.hotend_c,
      bed_c: this.state.bed_c,
      fan_pwm: this.state.fan_pwm,
    };
  }

  private newLayer(z: number): Layer {
    const start = this.snapshot();
    return {
      z,
      commands: [],
      startState: start,
      endState: start,
      temperatureChanges: [],
      stats: { time_s: 0, distance_mm: 0, volume_mm3: 0, weight_g: 0 },
    };
  }

  private finishLayer(layer: Layer): void {
    layer.endState = this.snapshot();
  }

  private addTime(layer: Layer, seconds: number): void {
    layer.stats.time_s += seconds;
    this.totals.time_s += seconds;
  }

  private recordTemperature(
    layer: Layer,
    target: "hotend" | "bed",
    value_c: number,
    wait: boolean,
  ): void {
    layer.temperatureChanges.push({
      commandIndex: layer.commands.length, // the command is pushed right after
      target,
      value_c,
      wait,
    });
  }

  /** Reads slicer comments such as "; nozzle_diameter = 0.4" or ";TIME:45000" */
  private readMetadata(line: string): void {
    const match = line.match(/^;\s*([^=:]+?)\s*[=:]\s*(.+?)\s*$/);
    if (match) this.metadata.set(match[1].toLowerCase(), match[2]);
  }

  // Example: input 100 seconds, output "1min 40s"
  private static formatDuration(totalSeconds: number): string {
    const total = Math.round(totalSeconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    if (m > 0) return `${m}min`;
    return `${total}s`;
  }

  // -------------------------------------------------------------------------
  // Existing public API (signatures unchanged)
  // -------------------------------------------------------------------------

  getFileName(): string {
    return this.options.fileName ?? "Unknown file";
  }

  // Return the total time simulated by the parser
  getPrintTime(): string {
    return ParserV2.formatDuration(this.totals.time_s);
  }

  // Returns the total material used as a formatted string (e.g., "12.3 g")
  getTotalMaterialUsedStr(): string {
    let grams = this.totals.weight_g;
    if (grams <= 0) {
      grams =
        parseFloat(this.metadata.get("total filament used [g]") ?? "0") || 0;
    }
    return grams > 0 ? `${grams.toFixed(1)} g` : "Unknown";
  }

  // Returns the total number of layers in the parsed G-code file
  // Each layer is a new Z height given by the G-code commands (G1 or G0) that change the Z coordinate.
  getLayersCount(): number {
    return this.layers.length;
  }

  // Returns the total number of layers as a formatted string (e.g., "12")
  getLayersCountStr(): string {
    return this.getLayersCount().toString() || "Unknown";
  }

  // Returns the nozzle size as a formatted string (e.g., "0.4 mm")
  getNozzleSizeStr(): string {
    const fromComment = parseFloat(this.metadata.get("nozzle_diameter") ?? "");
    const mm =
      this.options.nozzleDiameterMm ??
      (Number.isNaN(fromComment) ? DEFAULT_NOZZLE_MM : fromComment);
    return `${mm} mm`;
  }

  // Returns an array of the material used for each layer in grams
  getLayerMaterialUsedGArray(): number[] {
    return this.layers.map((layer) => layer?.stats?.weight_g ?? 0);
  }

  // Returns the total number of commands for a given layer
  getCommandsCountForLayer(layer: number): number {
    return this.layers[layer]?.commands.length || 0;
  }

  // Returns the total number of commands for a given layer and G-code command
  getCommandCountForLayerAndCode(layer: number, code: string): number {
    return (
      this.layers[layer]?.commands.filter((command) => command.code === code)
        .length || 0
    );
  }

  // Returns the command at the specified index within a given layer
  getCommand(layerIndex: number, commandIndex: number): Command | null {
    return this.layers[layerIndex]?.commands[commandIndex] || null;
  }

  // Returns all commands for a given layer
  // Example: [ { code: "G1", x: 10, y: 20, z: 0.3, e: 0.5 }, ... ]
  getCommandsForLayer(layer: number): Command[] {
    return this.layers[layer]?.commands || [];
  }

  // Returns all commands across all layers that have a defined Z coordinate
  getAllDefinedZCommands(): Command[] {
    return this.layers.flatMap((layer) =>
      layer.commands.filter((command) => command.z !== undefined),
    );
  }

  // Returns a histogram array for the specified layer, showing the count of each G-code command.
  // Example: [ "G1: 120", "G0: 30", "M104: 5" ]
  getHistogramArrayFromLayer(layer: number): Array<string> {
    const counts = new Map<string | undefined, number>();
    for (const cmd of this.getCommandsForLayer(layer)) {
      counts.set(cmd.code, (counts.get(cmd.code) ?? 0) + 1);
    }
    return Array.from(counts, ([code, freq]) => `${code}: ${freq}`);
  }

  // Returns all commands for a given layer that have valid X, Y, and E coordinates, optionally limited to a specified number of commands.
  getValidXYCommandsForLayer(layer: number, limit: number = 0): Command[] {
    const filteredPoints = this.getCommandsForLayer(layer).filter(
      (c) => c.x !== undefined && c.y !== undefined && c.e !== undefined,
    );
    return limit > 0 ? filteredPoints.slice(0, limit) : filteredPoints;
  }

  // -------------------------------------------------------------------------
  // New, additive API
  // -------------------------------------------------------------------------

  // Returns the total print time in seconds for the entire print job.
  // Example: 3600 (for a 1-hour print)
  getTotalPrintTimeSeconds(): number {
    return this.totals.time_s;
  }

  // Returns the print time in seconds for the specified layer.
  // Example: 300 (for a 5-minute layer)
  getLayerPrintTimeSeconds(layer: number): number {
    return this.layers[layer]?.stats.time_s ?? 0;
  }

  // Returns the total material used in grams for the entire print job.
  // Example: 50.5 (for 50.5 grams of filament)
  getTotalMaterialUsedG(): number {
    return this.totals.weight_g;
  }

  // Returns the material used in grams for the specified layer.
  getLayerMaterialUsedG(layer: number): number {
    return this.layers[layer]?.stats.weight_g ?? 0;
  }

  /** Hotend / bed / fan values in effect when the layer began. */
  // Example: { hotend: 200, bed: 60, fan: 100 } for START of layer x
  getTemperatureAtLayerStart(layer: number): PrinterSnapshot | null {
    const l = this.layers[layer];
    return l ? { ...l.startState } : null;
  }

  getTemperatureAtLayerEnd(layer: number): PrinterSnapshot | null {
    const l = this.layers[layer];
    return l ? { ...l.endState } : null;
  }

  /**
   * Returns an array of height changes for each layer.
   * Example: [0.2, 0.3, 0.25] for a print with three layers.
   */
  getAllHeightChangesLayerArray(): number[] {
    return this.layers.map((layer, i) => {
      const prevZ = i === 0 ? 0 : this.layers[i - 1].z;
      // Round to avoid floating-point noise like 0.30000000000000004
      return Math.round((layer.z - prevZ) * 1e4) / 1e4;
    });
  }

  /** M104/M109/M140/M190 issued inside this layer. */
  getTemperatureChangesForLayer(layer: number): TemperatureChange[] {
    return this.layers[layer]?.temperatureChanges.map((c) => ({ ...c })) ?? [];
  }

  getAllTemperatureChanges(): Array<TemperatureChange & { layer: number }> {
    return this.layers.flatMap((l, layer) =>
      l.temperatureChanges.map((c) => ({ ...c, layer })),
    );
  }

  /** Raw slicer comment value, e.g. getMetadata("filament_type"). */
  getMetadata(key: string): string | undefined {
    return this.metadata.get(key.toLowerCase());
  }
}
