"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModel = void 0;
const schemas_1 = require("./schemas");
class TasksModel {
}
exports.TasksModel = TasksModel;
_a = TasksModel;
TasksModel.find = async () => {
    const tasks = await schemas_1.Task.find({}).lean();
    return tasks;
};
TasksModel.findById = async (id) => {
    const task = await schemas_1.Task.findById(id).populate("user").lean();
    return task;
};
TasksModel.findByUserId = async (userId) => {
    const tasks = await schemas_1.Task.find({ user: userId }).lean();
    return tasks;
};
TasksModel.findByUserIdAndTaskId = async (userId, taskId) => {
    const task = await schemas_1.Task.findOne({ user: userId, _id: taskId }).populate("user").lean();
    return task;
};
TasksModel.create = async (params) => {
    const newTask = await new schemas_1.Task(params).save();
    const plainTask = newTask.toObject();
    const user = plainTask.user?.prototype?._id;
    return { ...plainTask, user };
};
TasksModel.updateById = async (id, params) => {
    const updatedTask = await schemas_1.Task.findByIdAndUpdate(id, params, {
        new: true,
    }).lean();
    return updatedTask;
};
TasksModel.updateByUserIdAndTaskId = async (userId, taskId, params) => {
    const udpatedTask = await schemas_1.Task.findOneAndUpdate({ user: userId, _id: taskId }, params, {
        new: true,
    }).lean();
    return udpatedTask;
};
TasksModel.deleteByUserIdAndTaskId = async (userId, taskId) => {
    await schemas_1.Task.findOneAndDelete({ user: userId, _id: taskId });
};
TasksModel.deleteById = async (id) => {
    await schemas_1.Task.findByIdAndDelete(id);
};
TasksModel.deleteAllTasksFromUserById = async (id) => {
    await schemas_1.Task.deleteMany({ user: id });
};
