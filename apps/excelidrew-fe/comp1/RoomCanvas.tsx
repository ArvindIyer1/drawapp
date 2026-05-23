"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId} : {roomId:string}){

  
  const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
      //@ts-ignore
      // const ws = new WebSocket(`${WS_URL}?token${localStorage.getItem(token)}`);
      const ws = new WebSocket(`${WS_URL}?token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDIyMGYwMC0yYTNkLTRiOWYtYmY4OC05OWI0MTc4YTE3NGMiLCJpYXQiOjE3Nzk1NjI2MDR9.LY8A1yQujLijCT0b1-VTYYIL8rpCtMgqbdmtpoWgaHk`);
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDIyMGYwMC0yYTNkLTRiOWYtYmY4OC05OWI0MTc4YTE3NGMiLCJpYXQiOjE3Nzk1NjI0Nzl9.6A8Q3jPjLuQWkuYM3p1ujRhqF7KHR5AC3Unm031vxHo

     
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