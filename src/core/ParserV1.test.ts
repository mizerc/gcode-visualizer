import { describe, expect, it } from "vitest";
import { ParserV1 } from "./ParserV1";

const sample = [
  "G1 Z0.2 F1200",
  "G1 X10 Y0 E1 F1200",
  "G1 X10 Y10 E2 ; trailing comment",
  "M104 S200",
  "",
  "G1 Z0.4",
  "G1 X0 Y10 E3",
].join("\n");

describe("ParserV1", () => {
  it("handles empty content", () => {
    const p = new ParserV1("");
    expect(p.getLayersCount()).toBe(0);
    expect(p.getLayersCountStr()).toBe("0");
    expect(p.getCommandsForLayer(0)).toEqual([]);
    expect(p.getCommand(0, 0)).toBeNull();
    expect(p.getCommandsCountForLayer(5)).toBe(0);
  });

  it("skips blank lines and trims whitespace", () => {
    const p = new ParserV1("  G1 X1 Y1 E1  \n\n   \n");
    expect(p.getCommandsCountForLayer(0)).toBe(1);
    expect(p.getCommand(0, 0)?.line).toBe("G1 X1 Y1 E1");
  });

  it("marks whole-line comments", () => {
    const p = new ParserV1("; hello");
    expect(p.getCommand(0, 0)?.code).toBe("COMMENT");
  });

  it("ignores trailing comments", () => {
    const p = new ParserV1("G1 X5 Y5 E1 ; note");
    const cmd = p.getCommand(0, 0)!;
    expect(cmd.code).toBe("G1");
    expect(cmd.x).toBe(5);
  });

  it("parses G, M, X, Y, Z, E, F params", () => {
    const p = new ParserV1("G1 X1.5 Y2 Z3 E4 F600");
    const cmd = p.getCommand(0, 0)!;
    expect(cmd).toMatchObject({ code: "G1", x: 1.5, y: 2, z: 3, e: 4, f: 600 });
    expect(cmd.last_seen_f_mm_s).toBe(10);
    expect(cmd.last_seen_z).toBe(3);
    expect(new ParserV1("M104 S200").getCommand(0, 0)?.code).toBe("M104");
  });

  it("splits layers on Z changes of G0/G1 only", () => {
    const p = new ParserV1(sample);
    expect(p.getLayersCount()).toBe(2);
    expect(p.getLayersCountStr()).toBe("2");
    expect(p.layers[0].z).toBe(0.2);
    expect(p.layers[1].z).toBe(0.4);
    expect(p.getCommandsCountForLayer(0)).toBe(4);
    expect(p.getCommandsCountForLayer(1)).toBe(2);
  });

  it("does not start a layer for non-move Z or same Z", () => {
    const p = new ParserV1("G1 Z1\nG1 Z1 X1\nM1 Z5\nG1 X2");
    expect(p.getLayersCount()).toBe(1);
  });

  it("computes distance, volume, weight and flow", () => {
    const p = new ParserV1("G1 F600\nG1 X3 Y4 E2");
    const cmd = p.getCommand(0, 1)!;
    const volume = Math.PI * (1.75 / 2) ** 2 * 2;
    expect(cmd.distance).toBeCloseTo(5);
    expect(cmd.extruded_volume_mm3).toBeCloseTo(volume);
    expect(cmd.weight_g).toBeCloseTo(volume * 0.00124);
    expect(cmd.volume_per_distance).toBeCloseTo(volume / 5);
    expect(cmd.velocity_mm_s).toBeCloseTo(0.5);
    expect(cmd.flow_mm3_s).toBeCloseTo(volume / 10);
  });

  it("uses last X/Y when one axis is missing and tracks last E", () => {
    const p = new ParserV1("G1 X3 Y4 E1\nG1 X6 E2");
    const cmd = p.getCommand(0, 1)!;
    expect(cmd.distance).toBeCloseTo(3);
  });

  it("omits velocity/flow without a known feedrate", () => {
    const cmd = new ParserV1("G1 X3 Y4 E1").getCommand(0, 0)!;
    expect(cmd.velocity_mm_s).toBeUndefined();
    expect(cmd.flow_mm3_s).toBeUndefined();
  });

  it("does not compute extrusion data without E or XY", () => {
    const p = new ParserV1("G1 X3 Y4\nG1 E5");
    expect(p.getCommand(0, 0)?.distance).toBeUndefined();
    expect(p.getCommand(0, 1)?.distance).toBeUndefined();
  });

  it("counts commands by code", () => {
    const p = new ParserV1(sample);
    expect(p.getCommandCountForLayerAndCode(0, "G1")).toBe(3);
    expect(p.getCommandCountForLayerAndCode(0, "M104")).toBe(1);
    expect(p.getCommandCountForLayerAndCode(0, "XX")).toBe(0);
    expect(p.getCommandCountForLayerAndCode(9, "G1")).toBe(0);
  });

  it("returns commands and null for out-of-range", () => {
    const p = new ParserV1(sample);
    expect(p.getCommand(0, 99)).toBeNull();
    expect(p.getCommand(9, 0)).toBeNull();
    expect(p.getCommandsForLayer(1)).toHaveLength(2);
  });

  it("returns all commands with defined Z", () => {
    const zs = new ParserV1(sample).getAllDefinedZCommands().map((c) => c.z);
    expect(zs).toEqual([0.2, 0.4]);
  });

  it("builds a histogram", () => {
    const p = new ParserV1(sample);
    expect(p.getHistogramArrayFromLayer(0)).toEqual(["G1: 3", "M104: 1"]);
    expect(p.getHistogramArrayFromLayer(9)).toEqual([]);
  });

  it("filters valid XY commands with optional limit", () => {
    const p = new ParserV1(sample);
    expect(p.getValidXYCommandsForLayer(0)).toHaveLength(2);
    expect(p.getValidXYCommandsForLayer(0, 1)).toHaveLength(1);
    expect(p.getValidXYCommandsForLayer(1)).toHaveLength(1);
    expect(p.getValidXYCommandsForLayer(9)).toEqual([]);
  });

  it("returns placeholder metadata", () => {
    const p = new ParserV1("");
    expect(p.getFileName()).toBe("Unknown file");
    expect(p.getPrintTime()).toBe("12h 38min");
    expect(p.getTotalMaterialUsedStr()).toBe("12.8 g");
    expect(p.getNozzleSize()).toBe("0.4 mm");
  });
});
