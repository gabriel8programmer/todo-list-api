"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const HttpError_1 = require("../errors/HttpError");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
const tasks_1 = require("../models/tasks");
const SaveUserSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    role: zod_1.z.enum(["ADMIN", "CLIENT"]).optional(),
});
const UpdateUserSchema = SaveUserSchema.partial();
class UsersController {
}
exports.UsersController = UsersController;
_a = UsersController;
UsersController.index = async (req, res, next) => {
    try {
        const data = await users_1.UsersModel.find();
        const usersWithPassword = data.map((user) => {
            const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = user;
            return { _id, name, email, role, isWithGoogle, isWithFacebook, tasks };
        });
        res.json(usersWithPassword);
    }
    catch (error) {
        next(error);
    }
};
UsersController.show = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await users_1.UsersModel.findById(id);
        if (!user)
            throw new HttpError_1.HttpError(404, "User not found!");
        const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = user;
        res.json({ _id, name, email, role, isWithGoogle, isWithFacebook, tasks });
    }
    catch (error) {
        next(error);
    }
};
UsersController.save = async (req, res, next) => {
    try {
        const body = SaveUserSchema.parse(req.body);
        // verify if user already exists in database
        const userExists = await users_1.UsersModel.findByEmail(body.email);
        if (userExists)
            throw new HttpError_1.HttpError(403, "User email address already exists!");
        //encrypt password
        body.password = await bcrypt_1.default.hash(body.password, 10);
        const newUser = await users_1.UsersModel.create(body);
        const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = newUser;
        res.status(201).json({
            message: "User created successfuly!",
            data: _id,
            name,
            email,
            role,
            isWithGoogle,
            isWithFacebook,
            tasks,
        });
    }
    catch (error) {
        next(error);
    }
};
UsersController.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = UpdateUserSchema.parse(req.body);
        // verify is user id is valid
        const user = await users_1.UsersModel.findById(id);
        if (!user)
            throw new HttpError_1.HttpError(404, "User not found!");
        // verify if user already exists in database
        const userExists = await users_1.UsersModel.findByEmail(body.email);
        if (userExists)
            throw new HttpError_1.HttpError(403, "User email address already exists!");
        // if password field exists then encrypt password
        if (body.password) {
            body.password = await bcrypt_1.default.hash(body.password, 10);
        }
        //   update user
        const userUpdated = await users_1.UsersModel.updateById(id, body);
        const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = userUpdated;
        res.json({
            message: "User updated successfuly!",
            data: { _id, name, email, role, isWithGoogle, isWithFacebook, tasks },
        });
    }
    catch (error) {
        next(error);
    }
};
UsersController.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        // verify is user id is valid
        const user = await users_1.UsersModel.findById(id);
        if (!user)
            throw new HttpError_1.HttpError(404, "User not found!");
        // delete user
        await users_1.UsersModel.deleteById(id);
        // delete all tasks in task's collection
        await tasks_1.TasksModel.deleteAllTasksFromUserById(id);
        res.json({ message: "User deleted successfuly!" });
    }
    catch (error) {
        next(error);
    }
};
