import { Router } from "express";
import AuthController from '../controllers/auth.js';
import { requireAuthenticated } from "../middlewares/authorization.js";

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
router.post("/restore-password", AuthController.sendEmailToRestorePassword);
router.get("/restore-password-confirmation/:token", AuthController.createNewPasswordView);
router.post("/create-password/:token", AuthController.restorePassword);

// user, premium or ardmin
router.get("/logout", requireAuthenticated, AuthController.logout);


export { router };
