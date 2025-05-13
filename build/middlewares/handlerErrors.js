"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerErrors = void 0;
const HttpError_1 = require("../errors/HttpError");
const HandlerErrors = (error, req, res, next) => {
    if (error instanceof HttpError_1.HttpError) {
        res.status(error.status).json({ message: error.message });
    }
    else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    }
    else {
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.HandlerErrors = HandlerErrors;
