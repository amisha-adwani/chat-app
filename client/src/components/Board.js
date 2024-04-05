import React, { startTransition, useEffect, useRef } from "react";

const Board = () => {
  const canvasRef = useRef(null);

  //drawing state variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  //function to draw
  const draw = (e) => {
    // if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      console.log("drawing");
      // Set line width
      ctx.lineWidth = 10;

      // Wall
      ctx.strokeRect(75, 140, 150, 110);

      // Door
      ctx.fillRect(130, 190, 40, 60);

      // Roof
      ctx.beginPath();
      ctx.moveTo(50, 140);
      ctx.lineTo(150, 60);
      ctx.lineTo(250, 140);
      ctx.closePath();
      ctx.stroke();
    }
  };
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ backgroundColor: "white", boxShadow:'10 10 10 10' }}
      />
    </div>
  );
};

export default Board;
