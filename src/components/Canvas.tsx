import React, { useRef, useEffect } from "react";

type CanvasProps = {
  width?: number;
  height?: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

const Canvas: React.FC<CanvasProps> = ({ width = 300, height = 150, draw }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        border: "2px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: "white"
      }}
    />
  );
};

export default Canvas;
