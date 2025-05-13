"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModel = void 0;
const schemas_1 = require("./schemas");
class TasksModel {
    static find = async () => {
        const tasks = await schemas_1.Task.find({}).lean();
        return tasks;
    };
    static findById = async (id) => {
        const task = await schemas_1.Task.findById(id).populate("user").lean();
        return task;
    };
    static findByUserId = async (userId) => {
        const tasks = await schemas_1.Task.find({ user: userId }).lean();
        return tasks;
    };
    static findByUserIdAndTaskId = async (userId, taskId) => {
        const task = await schemas_1.Task.findOne({ user: userId, _id: taskId }).populate("user").lean();
        return task;
    };
    static create = async (params) => {
        const newTask = await new schemas_1.Task(params).save();
        const plainTask = newTask.toObject();
        const user = plainTask.user?.prototype?._id;
        return { ...plainTask, user };
    };
    static updateById = async (id, params) => {
        const updatedTask = await schemas_1.Task.findByIdAndUpdate(id, params, {
            new: true,
        }).lean();
        return updatedTask;
    };
    static updateByUserIdAndTaskId = async (userId, taskId, params) => {
        const udpatedTask = await schemas_1.Task.findOneAndUpdate({ user: userId, _id: taskId }, params, {
            new: true,
        }).lean();
        return udpatedTask;
    };
    static deleteByUserIdAndTaskId = async (userId, taskId) => {
        await schemas_1.Task.findOneAndDelete({ user: userId, _id: taskId });
    };
    static deleteById = async (id) => {
        await schemas_1.Task.findByIdAndDelete(id);
    };
    static deleteAllTasksFromUserById = async (id) => {
        await schemas_1.Task.deleteMany({ user: id });
    };
}
exports.TasksModel = TasksModel;
