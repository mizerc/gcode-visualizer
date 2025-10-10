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
      style={{ border: "1px solid #ccc" }}
    />
  );
};

export default Canvas;
