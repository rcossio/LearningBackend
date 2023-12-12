import UsersService from '../services/users.js';
import passport from '../config/passportConfig.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import emailTransporter from '../config/email.js';

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
            res.redirect('/auth/registered-successfully'); 
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

    static createNewPasswordView(req, res, customResponse = {}) {
        return res.render('create-password', { ...customResponse, email: req.params.email, date: req.params.date });
    }

    static async sendEmailToRestorePassword(req, res) {
        const { email } = req.body;
        const user = await UsersService.getUserByEmail(email);

        if (!user) {
            return AuthController.restorePasswordView(req, res, { error: 'User not found' });
        }
        
        const date = Date.now()         // date as integer
        const mailOptions = {
            from: 'rworld@coder.com', 
            to: email,
            subject: 'Restore password',
            text: `Restore your password by going to this link: http://localhost:${config.server.port}/auth/restore-password-confirmation/${email}/${date}`   // TOFIX: Very insecure, encrypt the email and date, or create a code to save in the DB
        };

        try {
            await emailTransporter.sendMail(mailOptions);
            return AuthController.restorePasswordView(req, res, { message: `An restoration link was sent to ${email}. Please also check spam mailbox.` });
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'Failed to send email.' });
        }

    }

    static async restorePassword(req, res) {
        const { email, date } = req.params;
        const { newPassword, confirmPassword } = req.body;
        const user = await UsersService.getUserByEmail(email);

        if (!user) {
            return AuthController.restorePasswordView(req, res, { error: 'User not found' });
        }

        const currentDate = Date.now();
        const expirationTime = 60000; // 1 min
        if (currentDate - date > expirationTime) {
            return AuthController.restorePasswordView(req, res, { error: 'Link expired. Please try again.' });
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
            if (!(user._id === 0)) {
                UsersService.updateLoginDate(user._id);
            }
            res.redirect('/'); 
        })(req, res, next);
    }

    static githubAuth(req, res, next) {
        passport.authenticate('githubStrategy')(req, res, next);
    }

    static githubAuthCallback(req, res, next) {
        passport.authenticate('githubStrategy', (err, user, info) => {
            if (err || !user) {
                return res.redirect('/auth/login-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            UsersService.updateLoginDate(user._id);
            res.redirect('/'); 
        })(req, res, next);
    }

    static googleAuth(req, res, next) {
        passport.authenticate('googleStrategy', { scope: ['profile', 'email'] })(req, res, next);
    }

    static googleAuthCallback(req, res, next) {
        passport.authenticate('googleStrategy', (err, user, info) => {
            if (err || !user) {
                return res.redirect('/auth/login-failed');
            }
            AuthController.createJwtAndSetCookie(user, res);
            UsersService.updateLoginDate(user._id);
            res.redirect('/'); 
        })(req, res, next);
    }

    static logout(req, res) {
        if (req.auth.email !== config.admin.email) {
            UsersService.updateLoginDate(req.auth.id);
        }
        res.clearCookie('jwt');
        return res.redirect('/');
    }
    
}

export default AuthController;