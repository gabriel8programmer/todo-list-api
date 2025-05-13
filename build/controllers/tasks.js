"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = exports.SaveTaskSchema = void 0;
const zod_1 = require("zod");
const HttpError_1 = require("../errors/HttpError");
const tasks_1 = require("../models/tasks");
const users_1 = require("../models/users");
exports.SaveTaskSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["todo", "doing", "done"]).default("todo"),
    priority: zod_1.z.enum(["low", "medium", "high"]).default("low"),
});
const UpdateTaskSchema = exports.SaveTaskSchema.partial();
class TasksController {
    static all = async (req, res, next) => {
        try {
            const tasks = await tasks_1.TasksModel.find();
            res.json(tasks);
        }
        catch (error) {
            next(error);
        }
    };
    static index = async (req, res, next) => {
        try {
            const { id } = req.params;
            const tasks = await tasks_1.TasksModel.findByUserId(id);
            res.json(tasks);
        }
        catch (error) {
            next(error);
        }
    };
    static show = async (req, res, next) => {
        try {
            const { id, taskId } = req.params;
            const task = await tasks_1.TasksModel.findById(taskId);
            if (!task)
                throw new HttpError_1.HttpError(404, "Task not found!");
            const data = await tasks_1.TasksModel.findById(taskId);
            const user = data?.user;
            let userData = {};
            if (user) {
                const { name, email, role, isWithFacebook, isWithGoogle } = user;
                userData = { name, email, role, isWithFacebook, isWithGoogle };
            }
            res.json({ ...data, user: userData });
        }
        catch (error) {
            next(error);
        }
    };
    static save = async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = await exports.SaveTaskSchema.parse(req.body);
            // create task
            const newTask = await tasks_1.TasksModel.create({ ...body, user: id });
            // update user tasksf
            await users_1.UsersModel.updateTasksFromUser(id);
            res.json({ message: `Task created successfuly`, data: newTask });
        }
        catch (error) {
            next(error);
        }
    };
    static update = async (req, res, next) => {
        try {
            const { id, taskId } = req.params;
            const task = await tasks_1.TasksModel.findById(taskId);
            if (!task)
                throw new HttpError_1.HttpError(404, "Task not found!");
            const body = await UpdateTaskSchema.parse(req.body);
            const updatedTask = await tasks_1.TasksModel.updateByUserIdAndTaskId(id, taskId, body);
            res.json({ message: "Task updated successfuly!", data: updatedTask });
        }
        catch (error) {
            next(error);
        }
    };
    static delete = async (req, res, next) => {
        try {
            const { id, taskId } = req.params;
            const task = await tasks_1.TasksModel.findById(taskId);
            if (!task)
                throw new HttpError_1.HttpError(404, "Task not found!");
            // delete task
            await tasks_1.TasksModel.deleteByUserIdAndTaskId(id, taskId);
            // delete task in user too
            await users_1.UsersModel.deleteTaskFromUser(id, taskId);
            res.json({ message: "Task deleted successfuly!" });
        }
        catch (error) {
            next(error);
        }
    };
    static deleteAll = async (req, res, next) => {
        try {
            const { id } = req.params;
            await tasks_1.TasksModel.deleteAllTasksFromUserById(id);
            res.json({ message: "All tasks were deleted successfuly!" });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.TasksController = TasksController;
