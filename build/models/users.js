"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const tasks_1 = require("./tasks");
const schemas_1 = require("./schemas");
class UsersModel {
    static find = async () => {
        const users = await schemas_1.User.find({}).populate("tasks").lean();
        return users;
    };
    static findById = async (id) => {
        const user = await schemas_1.User.findById(id).populate("tasks").lean();
        return user;
    };
    static findByEmail = async (email) => {
        const user = await schemas_1.User.findOne({ email }).populate("tasks").lean();
        return user;
    };
    static create = async (params) => {
        const newUser = await new schemas_1.User(params).save();
        return newUser.toObject();
    };
    static updateById = async (id, params) => {
        return schemas_1.User.findByIdAndUpdate(id, params, { new: true }).lean();
    };
    static updatePasswordByEmail = async (email, password) => {
        await schemas_1.User.findOneAndUpdate({ email }, { password }, { new: true }).lean();
    };
    static deleteById = async (id) => {
        await schemas_1.User.findByIdAndDelete(id);
    };
    static updateTasksFromUser = async (id) => {
        const tasks = await tasks_1.TasksModel.findByUserId(id);
        const taskIds = tasks.map(({ _id }) => _id);
        await schemas_1.User.findByIdAndUpdate(id, { tasks: taskIds });
    };
    static deleteTaskFromUser = async (id, taskId) => {
        const tasks = await tasks_1.TasksModel.findByUserId(id);
        const taskIdsRemaining = tasks
            .filter((task) => {
            if (task._id?.toString() !== taskId)
                return task;
        })
            .map(({ _id }) => _id);
        await schemas_1.User.findByIdAndUpdate(id, { tasks: taskIdsRemaining });
    };
}
exports.UsersModel = UsersModel;
