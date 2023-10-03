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

    static async registerView(req, res) {
        if (req.user) {
            return res.redirect('/profile');
        }
        res.render('register');
    }

    static async registrationSuccessView(req, res) {
        res.render('login', { message: 'User registered successfully. Please log in' });
    }

    static async registrationFailedView(req, res) {
        return res.render('register', { error: 'Unable to register user.' });
    }

    static async loginView(req, res) {
        try {
            if (req.user) {
                return res.redirect('/profile');
            }
            res.render('login');
        } catch (error) {
            console.log(error.message)
            res.render('login', { error: 'Unable to log in' });
        }
    }

    static async loginFailedView(req, res) {
        return res.render('login', { error: 'Unable to log in' });
    }

    static async restorePasswordView(req, res) {
        res.render('restore-password');
    }

    static async restorePassword(req, res) {
        try {
            const { email, newPassword, confirmPassword } = req.body;
            const user = await UsersService.getUserByEmail(email);

            if (!user) {
                return res.render('restore-password', { error: 'Password was not updatedPassword was not updated.' });
            }

            if (newPassword !== confirmPassword) {
                return res.render('restore-password', { error: 'Passwords do not match!' });
            }

            await UsersService.setUserPasswordByEmail(email, newPassword);
            res.status(200).render('login', { message: 'Password updated successfully. Please log in with your new password.' });
        } catch (error) {
            console.error(error.message);
            res.render('restore-password', { error: 'Your password could not be restored' });
        }
    }

    static registerUser(req, res, next) {
        passport.authenticate('signupStrategy', (error, user, info) => {
            if (error || !user) {
                return res.redirect('/auth/registered-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            res.redirect('/auth/registered-successfully'); 
        })(req, res, next);
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

    static async logout(req, res) {
        res.clearCookie('jwt');
        return res.redirect('/');
    }
    
}

export default AuthController;