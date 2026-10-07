import type { PrinterSnapshot } from "./ParserV2";

export interface IParser {
  getLayersCount(): number;
  getCommandsCountForLayer(layer: number): number;

  // Get the total number of layers as a string
  getLayersCountStr(): string;

  // Get the nozzle size as a string
  getNozzleSizeStr(): string;

  // === HEIGHT STATS ===
  getAllHeightChangesLayerArray(): number[];

  // === TEMPERATURE STATS ===
  getTemperatureAtLayerStart(layer: number): PrinterSnapshot | null;
  getTemperatureAtLayerEnd(layer: number): PrinterSnapshot | null;

  // === TIME STATS ===

  // Get the estimated print time as a string
  // Example: "1h 23m"
  getPrintTime(): string;

  // === DISTANCE STATS ===

  // === MATERIAL PER COMMAND ===

  // === MATERIAL USAGE ===

  // Get the total material used as a string in grams
  // Example: "12.34g"
  getTotalMaterialUsedStr(): string;

  // Get the total material used in grams
  getTotalMaterialUsedG(): number;

  // Get array of material used for each layer in grams
  getLayerMaterialUsedGArray(): number[];

  // Get the material used for a specific layer in grams
  getLayerMaterialUsedG(layer: number): number;
}

export type IParserConstructor = new (gcodeFileContent: string) => IParser;
