import { Router } from "express";
import passport from '../config/passportConfig.js';
import authController from '../controllers/auth.js';

const router = Router();

router.get("/register", authController.registerView);
router.post("/register", passport.authenticate('signupStrategy', {
    successRedirect: '/auth/registered-successfully',
    failureRedirect: '/auth/registered-failed',
}));
router.get("/registered-successfully", authController.registrationSuccessView);
router.get("/registered-failed", authController.registrationFailedView);

router.get("/login", authController.loginView);
router.post("/login", passport.authenticate('loginStrategy', {
    successRedirect: '/',
    failureRedirect: '/auth/login-failed',
}));
router.get("/login-failed", authController.loginFailedView);

// Github auth
router.get("/github", passport.authenticate('githubStrategy'));
router.get("/github/callback", passport.authenticate('githubStrategy', {
    successRedirect: '/',
    failureRedirect: '/login-failed',
}));

// Google auth
router.get("/google", passport.authenticate('googleStrategy', { scope: ['profile', 'email'] }));
router.get("/google/callback", passport.authenticate('googleStrategy', {
    successRedirect: '/',
    failureRedirect: '/login-failed',
}));

router.get("/logout", authController.logout);
router.get("/restore-password", authController.restorePasswordView);
router.post("/restore-password", authController.restorePassword);

export { router };
