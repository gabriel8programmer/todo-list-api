import { Router } from "express";
import { AuthController as Auth } from "./controllers/auth";
import { UsersController as Users } from "./controllers/users";
import { TasksController as Task } from "./controllers/tasks";
import * as oAuth from "./middlewares/oAuth";
import { isAdmin, verifyToken as verify } from "./middlewares/auth";

const router = Router();

// AUTH ROUTES
router.post("/auth/register", Auth.register);
router.post("/auth/login", Auth.login);
router.post("/auth/social/google", oAuth.google, Auth.social);
router.post("/auth/social/facebook", Auth.social);
router.post("/auth/recover-password", Auth.recoverPassword);

// USER PUBLIC ROUTES
router.get("/users/:id", verify, Users.show);

// USER TASKS PUBLIC ROUTES
router.get("/users/:id/tasks", verify, Task.index);
router.get("/users/:id/tasks/:taskId", verify, Task.show);
router.post("/users/:id/tasks", verify, Task.save);
router.put("/users/:id/tasks/:taskId", verify, Task.update);
router.delete("/users/:id/tasks/:taskId", verify, Task.delete);

// USER ROUTES ONLY ADMINS
router.get("/admin/users", verify, isAdmin, Users.index);
router.get("/admin/users/:id", verify, isAdmin, Users.show);
router.post("/admin/users", verify, isAdmin, Users.save);
router.put("/admin/users/:id", verify, isAdmin, Users.update);
router.delete("/admin/users/:id", verify, isAdmin, Users.delete);
// TASK ROUTES ONLY ADMINS
router.get("/admin/tasks", verify, isAdmin, Task.index);
router.get("/admin/tasks/:id", verify, isAdmin, Task.show);
router.post("/admin/tasks", verify, isAdmin, Task.save);
router.put("/admin/tasks/:id", verify, isAdmin, Task.update);
router.delete("/admin/tasks/:id", verify, isAdmin, Task.delete);

export default router;
