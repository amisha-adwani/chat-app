import React, { useState, useEffect, useRef, useContext } from "react";
import ChatContext from "../context/ChatContext";
const Board = () => {
  const context = useContext(ChatContext);
  const {
    socket
  } = context;
  const canvasRef = useRef(null);


  useEffect(()=>{
 if(socket){
  socket.on('canvasImage', (data) =>{
    const image = new Image()
    image.src = data;

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    image.onload = () =>{
      ctx.drawImage(image,0,0)
    }
  })
 }
  },[socket])


  //drawing state variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {      
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //function to start drawing
    const startDrawing = (e) => {
      setIsDrawing(true);
      const x = e.offsetX;
      const y = e.offsetY;
      console.log("x", e.offsetX);
      console.log("y", e.offsetY);
      setLastX(x);
      setLastY(y);
      socket.emit('drawing',{x, y})
    };

    //function to draw
    const draw = (e) => {
      if (!isDrawing) return;
      if (ctx) {
        console.log("drawing");
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        setLastX(x);
        setLastY(y);
        socket.emit('drawing',{x, y} )
      }
    };

    // end drawing
    const endDrawing = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      socket.emit('endDrawing', (x, y))
      setIsDrawing(false);
    };
 
    socket.on('onDrawing',(data)=>{
      ctx.lineTo(data.x, data.y)
      ctx.stroke()
    })
    
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
