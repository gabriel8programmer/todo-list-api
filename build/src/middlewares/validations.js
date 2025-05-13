"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserByTask = void 0;
const HttpError_1 = require("../errors/HttpError");
const users_1 = require("../models/users");
const validateUserByTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const email = req.user?.email;
        const user = await users_1.UsersModel.findByEmail(email);
        if (!user)
            throw new HttpError_1.HttpError(404, "User not found!");
        if (user._id && user._id.toString() !== id && user.role !== "ADMIN") {
            throw new HttpError_1.HttpError(401, "Not authorized. Only admins can perform this operation.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateUserByTask = validateUserByTask;
