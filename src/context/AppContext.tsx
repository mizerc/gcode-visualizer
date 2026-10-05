import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { ParsedGcode } from "../core/Parser";

interface AppContextValue {
  gcodeFile: File | null;
  gcodeText: string | null;
  loading: boolean;
  parsedInstance: React.RefObject<ParsedGcode | null>;
  error: string | null;
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
  const parsedInstance = useRef<ParsedGcode | null>(null);
  // Insternal state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Layer and command state
  const [layer, setLayer] = useState(0);
  const [command, setCommand] = useState(0);

  const restCommand = useCallback(() => {
    setCommand(0);
  }, [command, layer]);

  const nextCommand = useCallback(() => {
    const maxCommandValue =
      (parsedInstance.current?.getCommandsCountForLayer(layer) || 1) - 1;
    setCommand(command + 1 < maxCommandValue ? command + 1 : maxCommandValue);
  }, [command, layer]);

  const prevCommand = useCallback(() => {
    setCommand(command - 1 < 0 ? 0 : command - 1);
  }, [command, layer]);

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
  }, [layer]);

  /**
   * Watch for changes to the selected file and update the file content accordingly.
   */
  useEffect(() => {
    if (!gcodeFile) {
      setGcodeText("");
      return;
    }

    gcodeFile.text().then((content) => {
      parsedInstance.current = new ParsedGcode(content);
      setGcodeText(content);
    });
  }, [gcodeFile]);

  const setGcodeFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      setFile(file);
      setGcodeText(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse G-code");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setGcodeText(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      gcodeFile,
      gcodeText,
      parsedInstance,
      loading,
      error,
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
    }),
    [gcodeFile, gcodeText, loading, error, setGcodeFile, clear],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
