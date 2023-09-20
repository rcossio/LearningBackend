import { Router } from "express";
import AuthController from '../controllers/auth.js';

const router = Router();

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

router.get("/logout", AuthController.logout);
router.get("/restore-password", AuthController.restorePasswordView);
router.post("/restore-password", AuthController.restorePassword);

export { router };
