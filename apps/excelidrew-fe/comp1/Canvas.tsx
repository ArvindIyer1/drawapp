import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rectangle" | "pencil";

export function Canvas({
  roomId,
  socket
}: {
  socket: WebSocket
  roomId: string
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setselecTool] = useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game])

  useEffect(() => {

    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket)
      setGame(g);

      return () => {
        g.destroy();
      }
    }


  }, [canvasRef]);

  return <div style={{
    height: "100vh",
    overflow: "hidden"
  }}>
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    <Topbar setselecTool={setselecTool} selectedTool={selectedTool}></Topbar>
  </div>
}

function Topbar({ selectedTool, setselecTool }: {
  selectedTool: Tool,
  setselecTool: (s: Tool) => void
}) {
  return <div style={{
    position: "fixed",
    left: 10,
    right: 10
  }}>
    <div className="flex gap-2">
      <IconButton activated={selectedTool === "pencil"} icon={<Pencil />} onClick={() => {
        setselecTool("pencil")
      }} ></IconButton>
      <IconButton activated={selectedTool === "rectangle"} icon={<RectangleHorizontal />} onClick={() => { setselecTool("rectangle") }} ></IconButton>
      <IconButton activated={selectedTool === "circle"} icon={<Circle />} onClick={() => { setselecTool("circle") }} ></IconButton>
    </div>
  </div>
}