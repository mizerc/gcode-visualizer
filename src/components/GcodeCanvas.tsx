import React, { useRef, useEffect } from "react";
import type { Command } from "../Parser";

// class Camera {
//   x: number;
//   y: number;
//   zoom: number;
//   constructor(x: number, y: number, zoom: number) {
//     this.x = x;
//     this.y = y;
//     this.zoom = zoom;
//   }

//   zoomIn() {
//     this.zoom *= 1.1;
//   }

//   zoomOut() {
//     this.zoom /= 1.1;
//   }

//   move(x: number, y: number) {
//     this.x += x;
//     this.y += y;
//   }
// }

export type Point = { x: number; y: number };

type GcodeCanvasProps = {
  points: Command[];
  width?: number;
  height?: number;
  bedW?: number;
  bedH?: number;
  strokeStyle?: string;
};

const GcodeCanvas: React.FC<GcodeCanvasProps> = ({
  points,
  width = 400,
  height = 400,
  bedW = 220,
  bedH = 220,
  strokeStyle = "black",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Normalize and draw points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    });

    const normalizedPoints = points.map(normalize);

    // Draw path
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(normalizedPoints[0].x!, normalizedPoints[0].y!);
    for (let i = 1; i < normalizedPoints.length; i++) {
      ctx.lineTo(normalizedPoints[i].x!, normalizedPoints[i].y!);
    }
    ctx.stroke();
  }, [points, width, height, strokeStyle, bedW, bedH]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
};

export default GcodeCanvas;
