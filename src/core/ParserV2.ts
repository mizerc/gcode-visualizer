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
  line: string;
  code?: string;
  x?: number;
  y?: number;
  z?: number;
  f?: number;
  e?: number;
  s?: number; // S parameter (temperature, fan speed, dwell seconds)
  // state
  last_seen_f_mm_s?: number;
  last_seen_z?: number;
  //
  distance?: number;
  extruded_volume_mm3?: number;
  weight_g?: number;
  volume_per_distance?: number;
  // time
  duration_s?: number;
  velocity_mm_s?: number;
  acceleration_mm_s2?: number;
  flow_mm3_s?: number;
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

export class ParserV2 {
  layers: Layer[] = [];

  private readonly options: ParserOptions;
  private readonly filamentDiameterMm: number;
  private readonly densityGPerMm3: number;
  private readonly accelerationMmS2: number;
  private readonly metadata = new Map<string, string>();

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

  private totals: LayerStats = {
    time_s: 0,
    distance_mm: 0,
    volume_mm3: 0,
    weight_g: 0,
  };

  constructor(content: string, options: ParserOptions = {}) {
    this.options = options;
    this.filamentDiameterMm =
      options.filamentDiameterMm ?? DEFAULT_FILAMENT_DIAMETER_MM;
    // g/cm³ -> g/mm³
    this.densityGPerMm3 =
      (options.filamentDensityGPerCm3 ?? DEFAULT_DENSITY_G_CM3) / 1000;
    this.accelerationMmS2 = options.accelerationMmS2 ?? 0;

    this.parse(content);
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
    for (const part of body.split(/\s+/)) {
      if (!part) continue;
      const letter = part.charAt(0).toUpperCase();
      const value = parseFloat(part.slice(1));
      if (Number.isNaN(value)) continue;

      if ((letter === "G" || letter === "M") && cmd.code === undefined) {
        cmd.code = letter + value;
      } else {
        params.set(letter, value);
      }
    }

    const assign = (key: "x" | "y" | "z" | "e" | "f" | "s", letter: string) => {
      const v = params.get(letter);
      if (v !== undefined) cmd[key] = v;
    };
    assign("x", "X");
    assign("y", "Y");
    assign("z", "Z");
    assign("e", "E");
    assign("f", "F");
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

      case "G4": // dwell
        this.addTime(layer, cmd.s ?? 0);
        if (cmd.s) cmd.duration_s = cmd.s;
        break;

      case "G28": // home (approximation: all axes to 0)
        s.x = 0;
        s.y = 0;
        s.z = 0;
        break;

      case "G90":
        s.relativeXYZ = false;
        break;
      case "G91":
        s.relativeXYZ = true;
        break;
      case "M82":
        s.relativeE = false;
        break;
      case "M83":
        s.relativeE = true;
        break;

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

      case "M104": // hotend, no wait
      case "M109": // hotend, wait
        if (cmd.s !== undefined) {
          s.hotend_c = cmd.s;
          this.recordTemperature(layer, "hotend", cmd.s, cmd.code === "M109");
        }
        break;

      case "M140": // bed, no wait
      case "M190": // bed, wait
        if (cmd.s !== undefined) {
          s.bed_c = cmd.s;
          this.recordTemperature(layer, "bed", cmd.s, cmd.code === "M190");
        }
        break;

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

  private executeMove(cmd: Command, layer: Layer): void {
    const s = this.state;
    const prev: Position = { x: s.x, y: s.y, z: s.z, e: s.e };
    const target = this.resolveTarget(cmd);

    if (cmd.f !== undefined) s.f = cmd.f;
    const feed_mm_s = s.f / 60;

    const deltaE = target.e - prev.e; // extruded amount in mm of filament
    const travel3d = Math.hypot(
      target.x - prev.x,
      target.y - prev.y,
      target.z - prev.z,
    );

    // Time (every move, including travel and retractions)
    const timedDistance = travel3d > 0 ? travel3d : Math.abs(deltaE);
    const duration = this.moveDuration(timedDistance, feed_mm_s);
    if (duration > 0) {
      cmd.duration_s = duration;
      this.addTime(layer, duration);
    }

    // Distance / extrusion (only XY moves that carry an E word)
    if ((cmd.x !== undefined || cmd.y !== undefined) && cmd.e !== undefined) {
      const distance_mm = new Vec2(target.x, target.y).distanceTo(
        new Vec2(prev.x, prev.y),
      );

      const radius = this.filamentDiameterMm / 2;
      const filamentVolume = Math.PI * radius * radius * deltaE; // mm³
      const weight = filamentVolume * this.densityGPerMm3;

      cmd.distance = distance_mm;
      cmd.extruded_volume_mm3 = filamentVolume;
      cmd.weight_g = weight;
      if (distance_mm > 0)
        cmd.volume_per_distance = filamentVolume / distance_mm;

      if (feed_mm_s > 0) {
        cmd.velocity_mm_s = feed_mm_s; // commanded speed
        if (duration > 0) cmd.flow_mm3_s = filamentVolume / duration;
      }

      // Only count forward extrusion so wipes/retractions don't cancel real usage
      if (deltaE > 0) {
        for (const bucket of [layer.stats, this.totals]) {
          bucket.distance_mm += distance_mm;
          bucket.volume_mm3 += filamentVolume;
          bucket.weight_g += weight;
        }
      }
    }

    s.x = target.x;
    s.y = target.y;
    s.z = target.z;
    s.e = target.e;
  }

  /** Where this G0/G1 ends up, honouring G90/G91 and M82/M83. Does not mutate state. */
  private resolveTarget(cmd: Command): Position {
    const s = this.state;
    const axis = (
      current: number,
      value: number | undefined,
      relative: boolean,
    ) => (value === undefined ? current : relative ? current + value : value);

    return {
      x: axis(s.x, cmd.x, s.relativeXYZ),
      y: axis(s.y, cmd.y, s.relativeXYZ),
      z: axis(s.z, cmd.z, s.relativeXYZ),
      e: axis(s.e, cmd.e, s.relativeE),
    };
  }

  /** Constant-speed time, or trapezoidal profile if an acceleration was supplied. */
  private moveDuration(distance: number, feed_mm_s: number): number {
    if (distance <= 0 || feed_mm_s <= 0) return 0;
    const a = this.accelerationMmS2;
    if (!a) return distance / feed_mm_s;

    const rampDistance = (feed_mm_s * feed_mm_s) / a; // accel + decel
    return distance >= rampDistance
      ? distance / feed_mm_s + feed_mm_s / a
      : 2 * Math.sqrt(distance / a);
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

  private static parseDuration(text: string): number {
    if (/^\d+(\.\d+)?$/.test(text)) return parseFloat(text); // plain seconds (Cura)
    let seconds = 0;
    const units: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
    for (const m of text.matchAll(/(\d+)\s*([dhms])/g)) {
      seconds += parseInt(m[1], 10) * units[m[2]];
    }
    return seconds;
  }

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

  getPrintTime(): string {
    // Prefer the slicer's own estimate (it models acceleration), else our simulation
    const slicer =
      this.metadata.get("estimated printing time (normal mode)") ??
      this.metadata.get("time");
    const slicerSeconds = slicer ? ParserV2.parseDuration(slicer) : 0;
    const seconds = slicerSeconds > 0 ? slicerSeconds : this.totals.time_s;
    return seconds > 0 ? ParserV2.formatDuration(seconds) : "Unknown";
  }

  getTotalMaterialUsedStr(): string {
    let grams = this.totals.weight_g;
    if (grams <= 0) {
      grams =
        parseFloat(this.metadata.get("total filament used [g]") ?? "0") || 0;
    }
    return grams > 0 ? `${grams.toFixed(1)} g` : "Unknown";
  }

  getLayersCount(): number {
    return this.layers.length;
  }
  getLayersCountStr(): string {
    return this.getLayersCount().toString() || "Unknown";
  }

  getNozzleSize(): string {
    const fromComment = parseFloat(this.metadata.get("nozzle_diameter") ?? "");
    const mm =
      this.options.nozzleDiameterMm ??
      (Number.isNaN(fromComment) ? DEFAULT_NOZZLE_MM : fromComment);
    return `${mm} mm`;
  }

  getCommandsCountForLayer(layer: number): number {
    return this.layers[layer]?.commands.length || 0;
  }

  getCommandCountForLayerAndCode(layer: number, code: string): number {
    return (
      this.layers[layer]?.commands.filter((command) => command.code === code)
        .length || 0
    );
  }

  getCommand(layer: number, command: number): Command | null {
    return this.layers[layer]?.commands[command] || null;
  }

  getCommandsForLayer(layer: number): Command[] {
    return this.layers[layer]?.commands || [];
  }

  getAllDefinedZCommands(): Command[] {
    return this.layers.flatMap((layer) =>
      layer.commands.filter((command) => command.z !== undefined),
    );
  }

  getHistogramArrayFromLayer(layer: number): Array<string> {
    const counts = new Map<string | undefined, number>();
    for (const cmd of this.getCommandsForLayer(layer)) {
      counts.set(cmd.code, (counts.get(cmd.code) ?? 0) + 1);
    }
    return Array.from(counts, ([code, freq]) => `${code}: ${freq}`);
  }

  getValidXYCommandsForLayer(layer: number, limit: number = 0): Command[] {
    const filteredPoints = this.getCommandsForLayer(layer).filter(
      (c) => c.x !== undefined && c.y !== undefined && c.e !== undefined,
    );
    return limit > 0 ? filteredPoints.slice(0, limit) : filteredPoints;
  }

  // -------------------------------------------------------------------------
  // New, additive API
  // -------------------------------------------------------------------------

  getTotalPrintTimeSeconds(): number {
    return this.totals.time_s;
  }

  getLayerPrintTimeSeconds(layer: number): number {
    return this.layers[layer]?.stats.time_s ?? 0;
  }

  getTotalMaterialUsedG(): number {
    return this.totals.weight_g;
  }

  getLayerMaterialUsedG(layer: number): number {
    return this.layers[layer]?.stats.weight_g ?? 0;
  }

  /** Hotend / bed / fan values in effect when the layer began. */
  getTemperatureAtLayerStart(layer: number): PrinterSnapshot | null {
    const l = this.layers[layer];
    return l ? { ...l.startState } : null;
  }

  getTemperatureAtLayerEnd(layer: number): PrinterSnapshot | null {
    const l = this.layers[layer];
    return l ? { ...l.endState } : null;
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
