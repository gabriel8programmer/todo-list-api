"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    status;
    message;
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
exports.HttpError = HttpError;
