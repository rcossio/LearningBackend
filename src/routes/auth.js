import { Router } from "express";
import AuthController from '../controllers/auth.js';
import { checkRole } from "../middlewares/roles.js";

const router = Router();

// public
router.get("/register", AuthController.registerView);
router.post("/register", AuthController.registerUser);

router.get("/registered-successfully", AuthController.registrationSuccessView);
router.get("/registered-failed", AuthController.registrationFailedView);

router.get("/login", AuthController.loginView);
router.post("/login", AuthController.loginUser);

router.get("/login-failed", AuthController.loginFailedView);

router.get("/github", AuthController.githubAuth);
router.get("/github/callback", AuthController.githubAuthCallback);

router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleAuthCallback);

router.get("/restore-password", AuthController.restorePasswordView);
router.post("/restore-password", AuthController.restorePassword);

// user or ardmin
router.get("/logout", checkRole(['user','admin']), AuthController.logout);


export { router };
