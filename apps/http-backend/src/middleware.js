"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
function middleware(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : auth;
    if (!token) {
        return res.status(403).json({ msg: "no token" });
    }
    try {
        jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        next();
    }
    catch {
        return res.status(403).json({ msg: "invalid token" });
    }
}
