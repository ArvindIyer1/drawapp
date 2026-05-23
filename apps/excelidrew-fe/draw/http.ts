// 

import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getexistingShapes(slug: string) {
  const roomRes = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
  const roomId = roomRes.data.room.id;

  const chatsRes = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = chatsRes.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}