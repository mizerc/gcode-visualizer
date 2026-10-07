export interface IParser {
  getLayersCount(): number;
  getCommandsCountForLayer(layer: number): number;

  // Get the total number of layers as a string
  getLayersCountStr(): string;

  // Get the estimated print time as a string
  // Example: "1h 23m"
  getPrintTime(): string;

  // Get the total material used as a string in grams
  // Example: "12.34g"
  getTotalMaterialUsedStr(): string;

  // Get the nozzle size as a string
  getNozzleSizeStr(): string;

  getTotalMaterialUsedG(): number;

  // Get the material used for a specific layer in grams
  getLayerMaterialUsedG(layer: number): number;
}

export type IParserConstructor = new (gcodeFileContent: string) => IParser;
