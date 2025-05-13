"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const HttpError_1 = require("../errors/HttpError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
// zod schemas
const RegisterSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const SocialSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    isWithGoogle: zod_1.z.boolean().optional(),
    isWithFacebook: zod_1.z.boolean().optional(),
});
const RecoverPassword = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
class AuthController {
    static register = async (req, res, next) => {
        try {
            const body = RegisterSchema.parse(req.body);
            // verify if user already exists in database
            const userExists = await users_1.UsersModel.findByEmail(body.email);
            if (userExists)
                throw new HttpError_1.HttpError(403, "User email address already exists!");
            // crypted password
            body.password = await bcrypt_1.default.hash(body.password, 10);
            // create user
            const user = await users_1.UsersModel.create(body);
            const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;
            res.status(201).json({
                message: "User regitered with successfuly!",
                data: { _id, name, email, role, isWithGoogle, isWithFacebook },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static login = async (req, res, next) => {
        try {
            const { email: userEmail, password } = LoginSchema.parse(req.body);
            // validate user and password
            const user = await users_1.UsersModel.findByEmail(userEmail);
            const passwordPassed = await bcrypt_1.default.compare(password, user?.password);
            if (!user || !passwordPassed)
                throw new HttpError_1.HttpError(401, "Invalid Credentials!");
            // create access token jwt
            const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
            const accessToken = await jsonwebtoken_1.default.sign({ email: user.email }, jwtKey, { expiresIn: "1d" });
            const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;
            res.json({
                message: "Logged successfuly!",
                data: { _id, name, email, role, isWithFacebook, isWithGoogle },
                accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    };
    static social = async (req, res, next) => {
        try {
            const body = SocialSchema.parse(req.user);
            const user = await users_1.UsersModel.findByEmail(body.email);
            // create user
            if (!user) {
                const newUser = await users_1.UsersModel.create(body);
                // create access token jwt
                const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
                const accessToken = await jsonwebtoken_1.default.sign({ email: newUser.email }, jwtKey, { expiresIn: "1d" });
                const { _id, name, email, role, isWithFacebook, isWithGoogle } = newUser;
                // returning user and accesstoken
                return res.status(201).json({
                    message: "User regitered with successfuly!",
                    data: { _id, name, email, role, isWithFacebook, isWithGoogle },
                    accessToken,
                });
            }
            // create access token jwt
            const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
            const accessToken = await jsonwebtoken_1.default.sign({ email: user.email }, jwtKey, { expiresIn: "1d" });
            const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;
            res.json({
                message: "Logged successfuly!",
                data: { _id, name, email, role, isWithFacebook, isWithGoogle },
                accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    };
    static recoverPassword = async (req, res, next) => {
        try {
            const { email, password } = RecoverPassword.parse(req.body);
            // verify if user already exists in database
            const user = await users_1.UsersModel.findByEmail(email);
            if (!user)
                throw new HttpError_1.HttpError(404, "User not found!");
            if (user.isWithFacebook || user.isWithGoogle) {
                throw new HttpError_1.HttpError(400, "User already autheticated with social method!");
            }
            // encrypt password
            const encryptedPassword = await bcrypt_1.default.hash(password, 10);
            // recover password
            await users_1.UsersModel.updatePasswordByEmail(email, encryptedPassword);
            res.json({ message: "Password recovered successfuly!" });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
