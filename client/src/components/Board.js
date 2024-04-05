import React, { useState, useEffect, useRef } from "react";

const Board = () => {
  const canvasRef = useRef(null);
  //drawing state variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {      
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const startDrawing = (e) => {
      setIsDrawing(true);
      console.log("x", e.offsetX);
      console.log("y", e.offsetY);
      setLastX(e.offsetX);
      setLastY(e.offsetY);
    };

    //function to draw
    const draw = (e) => {
      if (!isDrawing) return;
      if (ctx) {
        console.log("drawing");
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      }
    };

    // end drawing
    const endDrawing = () => {
      setIsDrawing(false);
    };
    
    // Event listeners for drawing
    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDrawing);
      canvas.addEventListener('mouseout', endDrawing);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDrawing);
        canvas.removeEventListener('mouseout', endDrawing);
      }
    };
  }, [isDrawing, lastX, lastY]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ backgroundColor: "white", boxShadow: "10px 10px 10px" }}
      />
    </div>
  );
};

export default Board;
