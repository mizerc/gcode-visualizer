export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Vec2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export interface Command {
  line: string;
  code?: string;
  x?: number;
  y?: number;
  z?: number;
  f?: number;
  e?: number;
  // state
  last_seen_f_mm_s?: number;
  last_seen_z?: number;
  //
  distance?: number;
  extruded_volume_mm3?: number;
  weight_g?: number;
  volume_per_distance?: number;
  // time
  velocity_mm_s?: number;
  acceleration_mm_s2?: number;
  flow_mm3_s?: number;
}

interface Layer {
  z: number;
  commands: Command[];
}

export class ParsedGcode {
  layers: Layer[] = [];

  constructor(content: string) {
    const lines = content.split("\n").map((line) => line.trim());

    let currentZ = 0;
    let lastX = 0;
    let lastY = 0;
    let lastE = 0;
    let lastF = 0;
    let lastZ = 0;

    let currentLayer: Layer = { z: currentZ, commands: [] };

    for (const line of lines) {
      if (line.length === 0) {
        continue;
      }

      //   console.log("LINE:", line);
      const cmd: Command = {
        line,
      };

      const lineParts = line.split(" ");
      let partIndex = 0;
      for (const part of lineParts) {
        if (part.charAt(0) === ";") {
          if (partIndex === 0) {
            // whole line comment
            cmd.code = "COMMENT";
            // go to next line
            break;
          } else {
            // partial line comment
            // go to next line
            break;
          }
        }
        partIndex++;

        // part: ; M402 G1 X10.3 Y10 Z10 E10 F10
        const param = part.charAt(0);
        const value = parseFloat(part.replace(param, ""));

        cmd.last_seen_f_mm_s = lastF / 60; // mm/min to mm/s
        cmd.last_seen_z = lastZ;

        if (param === "X") {
          cmd.x = value;
        } else if (param === "Y") {
          cmd.y = value;
        } else if (param === "Z") {
          cmd.z = value;
          lastZ = value;
          cmd.last_seen_z = value;
        } else if (param === "E") {
          cmd.e = value;
        } else if (param === "F") {
          cmd.f = value;
          lastF = value;
          cmd.last_seen_f_mm_s = value / 60; // mm/min to mm/s
        } else if (param === "G") {
          cmd.code = "G" + value;
        } else if (param === "M") {
          cmd.code = "M" + value;
        }
      }

      if (
        cmd.z !== undefined &&
        cmd.z !== currentZ &&
        (cmd.code === "G1" || cmd.code === "G0")
      ) {
        // Start new layer
        currentZ = cmd.z;
        if (currentLayer.commands.length) {
          this.layers.push(currentLayer);
        }
        currentLayer = { z: currentZ, commands: [] };
      }

      // Compute distance and extrusion
      if ((cmd.x !== undefined || cmd.y !== undefined) && cmd.e !== undefined) {
        const x = cmd.x !== undefined ? cmd.x : lastX;
        const y = cmd.y !== undefined ? cmd.y : lastY;

        const distance_mm = new Vec2(x, y).distanceTo(new Vec2(lastX, lastY));
        const deltaE = cmd.e - lastE; // extruded ammount in mm

        const radius = 1.75 / 2; // PLA 1.75mm diameter
        const filamentVolume = Math.PI * radius * radius * deltaE; // area x length = volume in mm³
        const weight = filamentVolume * 0.00124; // 1.24 g/cm³ = 0.00124 g/mm³

        cmd.distance = distance_mm;
        cmd.extruded_volume_mm3 = filamentVolume;
        cmd.weight_g = weight;
        cmd.volume_per_distance = filamentVolume / distance_mm;

        if (cmd.last_seen_f_mm_s) {
          cmd.velocity_mm_s = cmd.distance / cmd.last_seen_f_mm_s;
          // cmd.acceleration_mm_s2 = cmd.velocity_mm_s / cmd.speed_mm_s;
          cmd.flow_mm3_s = cmd.extruded_volume_mm3 / cmd.last_seen_f_mm_s;
        }

        // Save current to use next command
        lastX = x;
        lastY = y;
        lastE = cmd.e;
      }

      // Save command into current layer
      currentLayer.commands.push(cmd);
    }

    if (currentLayer.commands.length) {
      this.layers.push(currentLayer);
    }
  }

  getLayersCount(): number {
    return this.layers.length;
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
      layer.commands.filter((command) => command.z !== undefined)
    );
  }

  getHistogramArrayFromLayer(layer: number): Array<string> {
    const uniqueCommands = new Map();

    this.layers[layer]?.commands.forEach((cmd) => {
      uniqueCommands.set(cmd.code, 0);
    });

    this.layers[layer]?.commands.forEach((cmd) => {
      const value = uniqueCommands.get(cmd.code);
      uniqueCommands.set(cmd.code, value + 1);
    });

    const result: string[] = [];
    for (const [code, freq] of uniqueCommands) {
      result.push(`${code}: ${freq}`);
    }

    return result;
  }

  getValidXYCommandsForLayer(layer: number, limit: number = 0): Command[] {
    const filteredPoints = [];
    const commandList = this.getCommandsForLayer(layer);
    for (const command of commandList) {
      if (
        command.x !== undefined &&
        command.y !== undefined &&
        command.e !== undefined
      ) {
        filteredPoints.push(command);
      }
    }

    if (limit > 0) {
      return filteredPoints.slice(0, limit);
    }

    return filteredPoints; // all points
  }
}
