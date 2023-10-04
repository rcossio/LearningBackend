import UsersService from '../services/users.js';
import passport from '../config/passportConfig.js';
import jwt from 'jsonwebtoken';
import {config} from '../config/config.js';


class AuthController {

    static createJwtAndSetCookie(user, res) {
        const jwt_payload = {
            id: user._id,
            cartId: user.cartId,
            chatId: user.chatId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        const options = { expiresIn: '1h' };
        const token = jwt.sign(jwt_payload, config.auth.jwtSecret, options);
        
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3600000
        });
    }

    static registerView(req, res,customResponse = {}) {
        return res.render('register', { ...customResponse });
    }

    static registerUser(req, res, next) {
        passport.authenticate('signupStrategy', (error, user, info) => {
            if (error || !user) {
                return res.redirect('/auth/registered-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            res.redirect('/auth/registered-successfully');    //<---
        })(req, res, next);
    }

    static registrationSuccessView(req, res) {
        return AuthController.loginView(req, res, { message: 'User registered successfully. Please log in' });
    }

    static registrationFailedView(req, res) {
        return AuthController.registerView(req, res, { error: 'Unable to register user.' });
    }

    static loginView(req, res, customResponse = {}) {
        return res.render('login', { ...customResponse });
    }

    static loginFailedView(req, res) {
        return AuthController.loginView(req, res, { error: 'Unable to log in' });
    }

    static restorePasswordView(req, res, customResponse = {}) {
        return res.render('restore-password', { ...customResponse });
    }

    static async restorePassword(req, res) {
        const { email, newPassword, confirmPassword } = req.body;
        const user = await UsersService.getUserByEmail(email);

        if (!user) {
            return AuthController.restorePasswordView(req, res, { error: 'User not found' });
        }

        if (newPassword !== confirmPassword) {
            return AuthController.restorePasswordView(req, res, { error: 'Passwords do not match!' });
        }

        await UsersService.setUserPasswordByEmail(email, newPassword);
        return AuthController.loginView(req, res, { message: 'Password updated successfully. Please log in with your new password.' });
    }

    static loginUser(req, res, next) {
        passport.authenticate('loginStrategy', (err, user, info) => {
            if (err || !user) {
                return res.redirect('/auth/login-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            res.redirect('/'); 
        })(req, res, next);
    }

    static githubAuth(req, res, next) {
        passport.authenticate('githubStrategy')(req, res, next);
    }

    static githubAuthCallback(req, res, next) {
        passport.authenticate('githubStrategy', (err, user, info) => {
            if (err || !user) {
                return res.redirect('/login-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            res.redirect('/'); 
        })(req, res, next);
    }

    static googleAuth(req, res, next) {
        passport.authenticate('googleStrategy', { scope: ['profile', 'email'] })(req, res, next);
    }

    static googleAuthCallback(req, res, next) {
        passport.authenticate('googleStrategy', (err, user, info) => {
            if (err || !user) {
                return res.redirect('/login-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            res.redirect('/'); 
        })(req, res, next);
    }

    static logout(req, res) {
        res.clearCookie('jwt');
        return res.redirect('/');
    }
    
}

export default AuthController;