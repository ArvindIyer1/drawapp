import { WebSocket, WebSocketServer } from 'ws';
// import jwt, { JwtPayload } from "jsonwebtoken";
import jwt , {JwtPayload} from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-change-me-in-production";
import { prismaClient } from '@repo/db';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws : WebSocket,
  rooms :string[],
  userId : string
}
const users :User[] = [];


function checkUser(token:string):string | null{
  try{
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null; 
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId ;
  }catch(e){
    return null;
  }
   return null;


}

wss.on('connection', function connection(ws,request) {
  const url = request.url
  
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if(userId == null){
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms:[],
    ws

  })

  
  

  ws.on('message', async function message(data) {
    let parsedData: any;
    const text = data.toString();
    try {
      parsedData = JSON.parse(text);
    } catch (err) {
      // ignore invalid messages
      return;
    }

    if(parsedData.type === "join_room"){
     const user = users.find(x => x.ws === ws);
     if (user) user.rooms.push(String(parsedData.roomId));
    }

    if(parsedData.type === "leave_room"){
     const user = users.find(x => x.ws === ws);
     if(!user) return;
     user.rooms = user.rooms.filter(x => x !== String(parsedData.room));
    }

     if(parsedData.type === "chat"){
      const roomId = String(parsedData.roomId);
      const message = parsedData.message;

      await prismaClient.chat.create({
        data:{
          roomId : Number(roomId),
          message,
          userId
        }
      })

      users.forEach(u => {
        if(u.rooms.includes(roomId)){
          u.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
      })
     }
  });

  

 
});