import React, { useState, useEffect, useRef, useContext } from "react";
import ChatContext from "../context/ChatContext";
import Box from "@mui/material/Box";


const Board = () => {
  const context = useContext(ChatContext);
  const { socket} = context;
  const canvasRef = useRef(null);


  //drawing state variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [currentColor, setCurrentColor] = useState('yellow');
  const [mode, setMode] = useState('pen');

  const eraserClick= ()=>{
    setMode('eraser')
  }

  useEffect(() => {      
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //function to start drawing
    const startDrawing = (e) => {
      setIsDrawing(true);
      const x = e.offsetX;
      const y = e.offsetY;
      setLastX(x);
      setLastY(y);
    };

    //function to draw
    const draw = (e) => {
      if (!isDrawing) return;
      if (ctx) {
        const x = e.offsetX;
        const y = e.offsetY;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if(mode === 'pen'){
          ctx.globalCompositeOperation="source-over";
          ctx.strokeStyle = currentColor;
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
        }
        else{
          //eraser
          ctx.globalCompositeOperation="destination-out";
          ctx.arc(lastX,lastY,8,0,Math.PI*2);
          ctx.fill();
        }
        setLastX(x);
        setLastY(y);
        socket.emit('drawing',{x: lastX, y: lastY,color: currentColor } )
      }
    };

    // end drawing
    const endDrawing = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      setLastX(x);
      setLastY(y);
      socket.emit('endDrawing', {x, y})
      setIsDrawing(false);
    };
 
    socket.on('onDrawing', (data) => {
      setCurrentColor(data.color); 
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = data.color; 
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });
    
    socket.on('onEndDrawing',(data)=>{
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    })
    
    // Event listeners for drawing
    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDrawing);
    }
      

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDrawing);
      }
    };
    // eslint-disable-next-line
  }, [socket,isDrawing, lastX]);

  const handleColorChange =(color)=>{
    setMode('pen')
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCurrentColor(color)
    ctx.strokeStyle = color;

   }

   const clearClick=()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   }

  return (
    <div>
      <Box sx={{ display:'flex',justifyContent:'space-between', width:600}}>
        <Box  sx={{display:'flex'}}>
    <Box sx={{height:30, width: 30, bgcolor:'black', cursor:'pointer'}} onClick={() => handleColorChange("black")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'red', cursor:'pointer'}} onClick={() => handleColorChange("red")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'green', cursor:'pointer'}} onClick={() => handleColorChange("green")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'blue', cursor:'pointer'}} onClick={() => handleColorChange("blue")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'yellow', cursor:'pointer'}} onClick={() => handleColorChange("yellow")}> </Box>
    </Box>
    <Box sx={{display:'flex'}}>
  <Box sx={{mr:2, cursor:'pointer'}} onClick={eraserClick}>Erase</Box>
  <Box sx={{mr:2, cursor:'pointer'}} onClick={clearClick}>Clear</Box>
  <Box>X</Box>
</Box>
      </Box>
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
