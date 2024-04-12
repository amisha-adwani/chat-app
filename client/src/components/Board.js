import React, { useState, useEffect, useRef, useContext } from "react";
import ChatContext from "../context/ChatContext";
import Box from "@mui/material/Box";
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Board = ({open,handleOpen}) => {
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
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
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
        socket.emit('drawing',{x: lastX, y: lastY,color: currentColor, mode } )
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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (data.mode === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        setCurrentColor(data.color); 
        ctx.strokeStyle = data.color; 
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
      } else if (data.mode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(data.x, data.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
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
        <div style={{display: open ? '': 'none' }}>
      <Box sx={{ display:'flex',justifyContent:'space-between', width:600}}>
        <Box  sx={{display:'flex'}}>
    <Box sx={{height:30, width: 30, bgcolor:'black', cursor:'pointer'}} onClick={() => handleColorChange("black")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'red', cursor:'pointer'}} onClick={() => handleColorChange("red")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'green', cursor:'pointer'}} onClick={() => handleColorChange("green")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'blue', cursor:'pointer'}} onClick={() => handleColorChange("blue")}> </Box>
    <Box sx={{height:30, width: 30, bgcolor:'yellow', cursor:'pointer'}} onClick={() => handleColorChange("yellow")}> </Box>
    <Tooltip title='Erase'>
      <IconButton  sx={{cursor: 'pointer' }} onClick={eraserClick}>
      <CleaningServicesIcon/>
      </IconButton>
    </Tooltip>
    <Tooltip title='Clear'>
      <IconButton  sx={{cursor: 'pointer' }} onClick={clearClick}>
      <ContentPasteOffIcon/>
      </IconButton>
    </Tooltip>
    </Box>
    <Tooltip title='Close' onClick={handleOpen}>
      <IconButton >
      <CloseIcon/>
      </IconButton>
    </Tooltip>

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
