"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const middleware_1 = require("./middleware");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", async (req, res) => {
    const parsedData = types_1.UserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            msg: "Email Address is already taken or incorrect inputs",
        });
    }
    const hashedP = await bcrypt_1.default.hash(req.body.password, 10);
    try {
        const userC = await client_1.prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedP,
                name: parsedData.data.name,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: userC.id }, config_1.JWT_SECRET);
        return res.json({
            msg: "User Successfully Created",
            token,
        });
    }
    catch {
        return res.status(411).json({
            msg: "user already exists",
        });
    }
});
app.post("/signin", async (req, res) => {
    const result = types_1.SigninSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            msg: "Email Address is already taken or incorrect inputs",
        });
    }
    const user = await client_1.prismaClient.user.findFirst({
        where: {
            email: result.data.username,
            password: result.data.password
        },
    });
    if (!user) {
        return res.status(403).json({
            msg: "User not found",
        });
    }
    const match = await bcrypt_1.default.compare(req.body.password, user.password);
    if (!match) {
        return res.status(403).json({
            msg: "Wrong password",
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
    }, config_1.JWT_SECRET);
    res.json({
        token,
    });
});
app.post("/room", middleware_1.middleware, async (req, res) => {
    const result = types_1.CreateRoomSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            msg: "Email Address is already taken or incorrect inputs",
        });
    }
    const userId = req.userId;
    try {
        const room = await client_1.prismaClient.room.create({
            data: {
                slug: result.data.name,
                adminId: userId
            }
        });
        res.json({
            roomId: room.id,
        });
    }
    catch (e) {
        return res.status(411).json({
            msg: "room alr exists"
        });
    }
});
app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = client_1.prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });
    res.json({
        messages
    });
});
app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = client_1.prismaClient.room.findFirst({
        where: {
            slug
        }
    });
    res.json({
        room
    });
});
app.listen(3001);
