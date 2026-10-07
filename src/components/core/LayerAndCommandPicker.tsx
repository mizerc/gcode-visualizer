import { useApp } from "@/context/AppContext";
import { useEffect, useRef } from "react";
import styled from "styled-components";
/* ---------- Public component ---------- */

export function LayerAndCommandPicker({
  hiddeCommand = false,
}: {
  hiddeCommand?: boolean;
}) {
  const {
    parsedInstance,
    layer,
    command,
    prevLayer,
    nextLayer,
    resetLayer,
    prevCommand,
    nextCommand,
    restCommand,
  } = useApp();

  // Add keyboard listeners for layer and command navigation
  const keyInputHandler = (e: KeyboardEvent) => {
    // Don't hijack arrows while typing
    const t = e.target as HTMLElement;
    if (t.matches("input, textarea, select, [contenteditable='true']")) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextLayer();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevLayer();
        break;
      case "ArrowUp":
        e.preventDefault();
        prevCommand();
        break;
      case "ArrowDown":
        e.preventDefault();
        nextCommand();
        break;
      case "Escape": // optional, if you want resetLayer on a key
        resetLayer();
        break;
    }
  };
  const active = true; // or a condition, e.g. isOpen
  const ref = useRef(keyInputHandler);
  ref.current = keyInputHandler;
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => ref.current(e);
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [active]);

  // Adjust these two lines to match the shape of parsedInstance.
  const layerCount = parsedInstance.current?.getLayersCount() || 0;

  const commandsCount =
    parsedInstance.current?.getCommandsCountForLayer(layer) || 0;

  return (
    <Panel aria-label="Playback navigation">
      <p>
        {hiddeCommand
          ? "Select a layer to analyze"
          : "Select a layer and command to analyze"}
      </p>

      {/* LAYER NAVIGATION */}
      <Stepper
        label="Layer"
        current={layer}
        total={layerCount}
        onPrev={prevLayer}
        onNext={nextLayer}
        onReset={resetLayer}
      />

      {/* COMMAND NAVIGATION */}
      {!hiddeCommand && (
        <Stepper
          label="Command"
          current={command}
          total={commandsCount}
          onPrev={prevCommand}
          onNext={nextCommand}
          onReset={restCommand}
        />
      )}

      {/* KEYBOARD HINT */}
      {!hiddeCommand && (
        <Hint>
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> change command · <Kbd>←</Kbd> <Kbd>→</Kbd>
          change layer
        </Hint>
      )}
      {hiddeCommand && (
        <Hint>
          <Kbd>←</Kbd> <Kbd>→</Kbd>
          change layer
        </Hint>
      )}
    </Panel>
  );
}

/* ---------- One reusable row instead of two copy-pasted sections ---------- */

interface StepperProps {
  label: string;
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

function Stepper({
  label,
  current,
  total,
  onPrev,
  onNext,
  onReset,
}: StepperProps) {
  const last = Math.max(total - 1, 0);
  const progress = last > 0 ? current / last : 0;

  return (
    <Row>
      <Label>{label}</Label>

      <Position>
        <Count>{current}</Count>
        <Max>/ {last}</Max>
        <Track
          role="progressbar"
          aria-label={`${label} progress`}
          aria-valuemin={0}
          aria-valuemax={last}
          aria-valuenow={current}
        >
          <Fill style={{ width: `${progress * 100}%` }} />
        </Track>
      </Position>

      <Actions>
        <Button
          onClick={onPrev}
          disabled={current <= 0}
          aria-label={`Previous ${label.toLowerCase()}`}
        >
          ← Prev
        </Button>
        <Button
          onClick={onNext}
          disabled={current >= last}
          aria-label={`Next ${label.toLowerCase()}`}
        >
          Next →
        </Button>
        <Button onClick={onReset} aria-label={`Reset ${label.toLowerCase()}`}>
          Reset
        </Button>
      </Actions>
    </Row>
  );
}

/* ---------- Styles ---------- */

const ink = "#1f2937";
const muted = "#6b7280";
const line = "#e5e7eb";
const accent = "#2563eb";

const Panel = styled.section`
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid ${line};
  border-radius: 8px;
  color: ${ink};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const Position = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  font-variant-numeric: tabular-nums;
`;

const Count = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${accent};
`;

const Max = styled.span`
  font-size: 13px;
  color: ${muted};
`;

const Track = styled.div`
  flex-basis: 100%;
  height: 4px;
  margin-top: 6px;
  background: ${line};
  border-radius: 2px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  background: ${accent};
  transition: width 120ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const Button = styled.button`
  min-width: unset;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${ink};
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:focus-visible {
    outline: 2px solid ${accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Hint = styled.p`
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid ${line};
  font-size: 12px;
  color: ${muted};
`;

const Kbd = styled.kbd`
  padding: 1px 6px;
  font-family: inherit;
  font-size: 11px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;
