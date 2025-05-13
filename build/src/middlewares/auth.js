"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const HttpError_1 = require("../errors/HttpError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const verifyToken = async (req, res, next) => {
    try {
        const completedToken = req.headers.authorization;
        if (!completedToken?.startsWith("Bearer"))
            throw new HttpError_1.HttpError(400, "Invalid bearer token!");
        const token = completedToken.split(" ")[1];
        if (!token)
            throw new HttpError_1.HttpError(400, "Invalid token!");
        // get payload
        const jwtKey = process.env.JWT_SECRET_KEY || "jwt_super_secret_key";
        const payload = jsonwebtoken_1.default.verify(token, jwtKey);
        if (typeof payload !== "string" && payload?.email) {
            const user = await users_1.UsersModel.findByEmail(payload.email);
            if (!user)
                throw new HttpError_1.HttpError(401, "Unauthorized!");
            const { email, role } = user;
            req.user = { email, role };
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    try {
        const role = req.user?.role;
        if (role !== "ADMIN") {
            throw new HttpError_1.HttpError(401, "Required ADMIN previlegies for performs this operation!");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAdmin = isAdmin;
