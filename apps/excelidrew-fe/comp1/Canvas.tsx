import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {Circle, Pencil, RectangleHorizontal} from "lucide-react";

type Shape = "circle"|"rectangle"|"pencil;

export function Canvas({
  roomId,
  socket
}:{
  socket : WebSocket
  roomId : string
}){

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setselecTool] = useState<Shape>("circle");

  useEffect(() => {
    //@ts-ignore
    window.selelectedTool = selectedTool;
  },[selectedTool])

    useEffect(() => {
    if(canvasRef.current){
      initDraw(canvasRef.current,roomId,socket);
    }
  },[canvasRef]);

    return <div style={{
      height:"100vh",
      overflow:"hidden"
    }}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <Topbar selectedTool={selectedTool}></Topbar>
    </div>
}

function Topbar({selectedTool,setselecTool}:{
  selectedTool:Shape,
  setselecTool : (s:Shape) => void
}){
  return <div style={{
      position:"fixed",
      left:10,
      right:10
    }}>
      <div className="flex gap-2">
      <IconButton activated={selectedTool === "pencil;"} icon={<Pencil/>} onClick={() => {
        setselecTool("pencil")
      }} ></IconButton>
      <IconButton activated={selectedTool === "rectangle"} icon={<RectangleHorizontal/>} onClick={() => {setselecTool("rectangle")}} ></IconButton>
      <IconButton activated={selectedTool === "circle"} icon={<Circle/>} onClick={() => {setselecTool("circle")}} ></IconButton>
      </div>
    </div>
}