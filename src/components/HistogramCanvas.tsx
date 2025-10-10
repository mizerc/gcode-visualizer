import React, { useRef, useEffect } from "react";
import type { Command } from "../Parser";

export type Point = { x: number; y: number };

type GcodeCanvasProps = {
  commands: Command[];
  width?: number;
  height?: number;
  bedW?: number;
  bedH?: number;
  strokeStyle?: string;
};

export const HistogramCanvas: React.FC<GcodeCanvasProps> = ({
  commands,
  width = 400,
  height = 150,
  bedW = 220,
  bedH = 220,
  strokeStyle = "black",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Normalize and draw points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || commands.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find min/max
    // const xs = points.map((p) => p.x);
    // const ys = points.map((p) => p.y);
    // const minX = Math.min(...xs);
    // const maxX = Math.max(...xs);
    // const minY = Math.min(...ys);
    // const maxY = Math.max(...ys);
    const minX = 0;
    const minY = 0;

    // const rangeX = maxX - minX || 1;
    // const rangeY = maxY - minY || 1;
    const rangeX = bedW;
    const rangeY = bedH;

    // Normalize and scale to canvas size (preserve aspect ratio)
    const normalize = (p: Command): Command => ({
      ...p,
      x: ((p.x! - minX) / rangeX) * width,
      y: height - ((p.y! - minY) / rangeY) * height, // Flip Y-axis for typical CNC view
      extruded_volume_mm3:
        ((p.extruded_volume_mm3 ? p.extruded_volume_mm3 : 1) / 0.2) * 80,
    });

    const normalizedPoints = commands.map(normalize);

    // Draw rects
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    for (let i = 1; i < normalizedPoints.length; i++) {
      const cmd = normalizedPoints[i];
      const h = cmd.extruded_volume_mm3 ? cmd.extruded_volume_mm3 : 1;
      ctx.fillRect(i * 2, 0, 1, h);
    }
  }, [commands, width, height, strokeStyle, bedW, bedH]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
};
