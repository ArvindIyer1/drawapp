
"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id
}: {
  messages:{messages:string}[];
  id: string
}){
  const [chats,setChats] = useState(messages);
  const [currentMsg,setCurrMsg] =useState("");
  const {socket,loading} = useSocket();

  useEffect(() => {
    if(socket && !loading){

      socket.send(JSON.stringify({
        type:"join_room",
        roomId : id
      }))
      socket.onmessage =(event) => {
        const parsedData = JSON.parse(event.data);

        if(parsedData.type === "chat"){
          setChats(c => [...c, {messages : parsedData.message}])
        }
      }
    }
  } ,[socket,loading,id] )

  return <div>
    {chats.map(m => <div>{m.messages}</div>)}

    <input type="text" value={currentMsg} onChange={ (e) => {
      setCurrMsg(e.target.value);
    }}></input>
    <button onClick={ () => {
      socket?.send(JSON.stringify({
        type:"chat",
        roomId :id,
        message : currentMsg 
      }))
      setCurrMsg("");
    }}>Send message </button>
  </div>
  
}