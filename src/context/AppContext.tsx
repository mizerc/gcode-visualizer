import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  useRef,
} from "react";
import { ParserV1 } from "../core/ParserV1";

interface AppContextValue {
  gcodeFile: File | null;
  gcodeFileName: string;
  gcodeText: string | null;
  isLoading: boolean;
  isLoaded: boolean;
  parsedInstance: React.RefObject<ParserV1 | null>;
  hasError: string | null;
  setGcodeFile: (file: File) => Promise<void>;
  clear: () => void;
  layer: number;
  setLayer: (layer: number) => void;
  command: number;
  setCommand: (command: number) => void;
  restCommand: () => void;
  nextCommand: () => void;
  prevCommand: () => void;
  nextLayer: () => void;
  prevLayer: () => void;
  resetLayer: () => void;
}

// Not exported: nobody should use this directly
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Hold the file instance
  const [gcodeFile, setFile] = useState<File | null>(null);
  // Hold the parsed G-code instance as text
  const [gcodeText, setGcodeText] = useState<string | null>(null);
  // Hold the parsed G-code instance as an object
  const parsedInstance = useRef<ParserV1 | null>(null);
  // Insternal state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  // Layer and command state
  const [layer, setLayer] = useState(0);
  const [command, setCommand] = useState(0);

  // gcodeFileName
  const gcodeFileName = gcodeFile?.name || "Not Loaded";

  const restCommand = useCallback(() => {
    setCommand(0);
  }, []);

  const nextCommand = useCallback(() => {
    const maxCommandValue =
      (parsedInstance.current?.getCommandsCountForLayer(layer) || 1) - 1;
    setCommand(command + 1 < maxCommandValue ? command + 1 : maxCommandValue);
  }, [command, layer]);

  const prevCommand = useCallback(() => {
    setCommand(command - 1 < 0 ? 0 : command - 1);
  }, [command]);

  const nextLayer = useCallback(() => {
    const maxLayerValue = (parsedInstance.current?.getLayersCount() || 1) - 1;
    setLayer(layer + 1 < maxLayerValue ? layer + 1 : maxLayerValue);
  }, [layer]);

  const prevLayer = useCallback(() => {
    setLayer(layer - 1 < 0 ? 0 : layer - 1);
  }, [layer]);

  // Reset layer to the first layer
  const resetLayer = useCallback(() => {
    setLayer(0);
  }, []);

  const setGcodeFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const text = await file.text();
      const parsed = new ParserV1(text);
      parsedInstance.current = parsed;
      setFile(file);
      setGcodeText(text);
      setIsLoaded(parsed.getLayersCount() > 0);
    } catch (e) {
      setHasError(e instanceof Error ? e.message : "Failed to parse G-code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setGcodeText(null);
    parsedInstance.current = null;
    setIsLoaded(false);
    setHasError(null);
  }, []);

  const value = useMemo(
    () => ({
      gcodeFile,
      gcodeText,
      parsedInstance,
      isLoading,
      isLoaded,
      hasError,
      setGcodeFile,
      clear,
      layer,
      setLayer,
      command,
      setCommand,
      restCommand,
      nextCommand,
      prevCommand,
      nextLayer,
      prevLayer,
      resetLayer,
      gcodeFileName,
    }),
    [
      gcodeFile,
      gcodeText,
      parsedInstance,
      isLoading,
      isLoaded,
      hasError,
      setGcodeFile,
      clear,
      layer,
      command,
      restCommand,
      nextCommand,
      prevCommand,
      nextLayer,
      prevLayer,
      resetLayer,
      gcodeFileName,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
