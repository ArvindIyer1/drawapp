"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId} : {roomId:string}){

  
  const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
      //@ts-ignore
      const ws = new WebSocket(`${WS_URL}?token${localStorage.getItem(token)}`);
  
      ws.onopen = () => {
        setSocket(ws);
        ws.send(JSON.stringify({
          type:"join_room",
          roomId 
        }))
      }
    },[]);


  

  if(!socket){
    return <div>
      Connecting to Server...
    </div>
  }

  return <div>
    <Canvas roomId = {roomId} socket = {socket}/>
  </div>
}