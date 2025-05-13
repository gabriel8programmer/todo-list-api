"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./controllers/auth");
const users_1 = require("./controllers/users");
const tasks_1 = require("./controllers/tasks");
const oAuth = __importStar(require("./middlewares/oAuth"));
const v = __importStar(require("./middlewares/validations"));
const auth_2 = require("./middlewares/auth");
const router = (0, express_1.Router)();
// AUTH ROUTES
router.post("/auth/register", auth_1.AuthController.register);
router.post("/auth/login", auth_1.AuthController.login);
router.post("/auth/social/google", oAuth.google, auth_1.AuthController.social);
router.post("/auth/social/facebook", auth_1.AuthController.social);
router.post("/auth/recover-password", auth_1.AuthController.recoverPassword);
// USER TASKS PUBLIC ROUTES
router.get("/users/:id/tasks", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.index);
router.get("/users/:id/tasks/:taskId", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.show);
router.post("/users/:id/tasks", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.save);
router.put("/users/:id/tasks/:taskId", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.update);
router.delete("/users/:id/tasks/:taskId", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.delete);
router.delete("/users/:id/tasks/delete-all", auth_2.verifyToken, v.validateUserByTask, tasks_1.TasksController.deleteAll);
// USER ROUTES ONLY ADMINS
router.get("/admin/users", auth_2.verifyToken, auth_2.isAdmin, users_1.UsersController.index);
router.get("/admin/users/:id", auth_2.verifyToken, auth_2.isAdmin, users_1.UsersController.show);
router.post("/admin/users", auth_2.verifyToken, auth_2.isAdmin, users_1.UsersController.save);
router.put("/admin/users/:id", auth_2.verifyToken, auth_2.isAdmin, users_1.UsersController.update);
router.delete("/admin/users/:id", auth_2.verifyToken, auth_2.isAdmin, users_1.UsersController.delete);
// TASK ROUTES ONLY ADMINS
router.get("/admin/tasks", auth_2.verifyToken, auth_2.isAdmin, tasks_1.TasksController.all);
exports.default = router;
