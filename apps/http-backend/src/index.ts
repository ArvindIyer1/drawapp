import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { UserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

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
  const { success } = SigninSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Email Address is already taken or incorrect inputs",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: req.body.username,
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
  const { success } = CreateRoomSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Email Address is already taken or incorrect inputs",
    });
  }

  res.json({
    roomId: 123,
  });
});

app.listen(3001);
