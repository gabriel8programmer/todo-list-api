import { Router } from "express";
import { AuthController as Auth } from "./controllers/auth";
import { UsersController as Users } from "./controllers/users";
import * as oAuth from "./middlewares/oAuth";
import { isAdmin, verifyToken as verify } from "./middlewares/auth";

const router = Router();

// AUTH ROUTES
router.post("/auth/register", Auth.register);
router.post("/auth/login", Auth.login);
router.post("/auth/social/google", oAuth.google, Auth.social);
router.post("/auth/social/facebook", Auth.social);
router.post("/auth/recover-password", Auth.recoverPassword);

// PUBLIC ROUTES
router.get("/users/:id/tasks", verify, Users.tasks);
router.get("/users/:id/tasks/:taskId", verify, Users.showTask);
router.post("/users/:id/tasks", verify, Users.saveTask);
router.put("/users/:id/tasks/:taskId", verify, Users.updateTask);
router.delete("/users/:id/tasks/:taskId", verify, Users.deleteTask);

// USER ROUTES ONLY ADMINS
router.get("/admin/users", verify, isAdmin, Users.index);
router.get("/admin/users/:id", verify, isAdmin, Users.show);
router.post("/admin/users", verify, isAdmin, Users.save);
router.put("/admin/users/:id", verify, isAdmin, Users.update);
router.delete("/admin/users/:id", verify, isAdmin, Users.delete);

export default router;
