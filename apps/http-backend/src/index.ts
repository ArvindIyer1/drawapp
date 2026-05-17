import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { UserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma, prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({
      msg: "Email Address is already taken or incorrect inputs",
    });
  }

  const hashedP = await bcrypt.hash(req.body.password, 10);

  try {
    const userC = await prisma.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedP,
        name: parsedData.data.name,
      },
    });
    const token = jwt.sign({ userId: userC.id }, JWT_SECRET);
    return res.json({
      msg: "User Successfully Created",
      token,
    });
  } catch {
    return res.status(411).json({
      msg: "user already exists",
    });
  }
});

app.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(411).json({
      msg: "Email Address is already taken or incorrect inputs",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: result.data.username,
      password:result.data.password
    },
  });

  if (!user) {
    return res.status(403).json({
      msg: "User not found",
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(403).json({
      msg: "Wrong password",
    });
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const result = CreateRoomSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(411).json({
      msg: "Email Address is already taken or incorrect inputs",
    });
  }

  //@ts-ignore
  const userId = req.userId;
  try{
    const room = await prisma.room.create({
      data:{
        slug : result.data.name,
        adminId : userId
      }
    })
    res.json({
      roomId: room.id,
    });
 }catch(e){
  return res.status(411).json({
    msg:"room alr exists"
  })
 }
});

app.get("/chats/:roomId" ,async (req,res) => {
    const roomId = Number(req.params.roomId);
    const messages = prismaClient.chat.findMany({
      where :{
        roomId:roomId
      },
      orderBy :{
        id :"desc"
      },
      take:50
    });
    res.json({
      messages
    }) 
  });

  app.get("/room/:slug" ,async (req,res) => {
    const slug = req.params.slug;
    const room = prismaClient.room.findFirst({
      where :{
        slug
      }
    });
    res.json({
      room
    }) 
  });

app.listen(3001);
