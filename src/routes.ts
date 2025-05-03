import { Router } from "express";
import { AuthController as Auth } from "./controllers/auth";

const router = Router();

// AUTH ROUTES
router.post("/auth/register", Auth.register);
router.post("/auth/login", Auth.login);
router.post("/auth/social/google", Auth.google);
router.post("/auth/forgot-password", Auth.forgotPassword);
router.post("/auth/recover-password", Auth.recoverPassword);

export default router;
