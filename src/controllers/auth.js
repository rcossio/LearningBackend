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
        const { token } = req.params;
        try{
            const decoded = jwt.verify(token, config.auth.jwtSecret);
            return res.render('create-password', { ...customResponse, token });
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'Link invalid or expired. Please try again.' });
        }
    }

    static async sendEmailToRestorePassword(req, res) {
        const { email } = req.body;
        let user;
        try {
            user = await UsersService.getUserByEmail(email);
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'User not found' });
        }

        const jwtPayload = { email: user.email };
        const options = { expiresIn: '1h' };
        const passwordResetToken = jwt.sign(jwtPayload, config.auth.jwtSecret, options);

        const passwordResetLink = `http://localhost:${config.server.port}/auth/restore-password-confirmation/${passwordResetToken}`;

        const mailOptions = {
            from: 'rworld@coder.com',
            to: email,
            subject: 'Restore password',
            text: `Restore your password by going to this link: ${passwordResetLink}`
        };

        try {
            await emailTransporter.sendMail(mailOptions);
            return AuthController.restorePasswordView(req, res, { message: `An restoration link was sent to ${email}. Please also check spam mailbox.` });
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'Failed to send email.' });
        }

    }

    static async restorePassword(req, res) {
        let email;
        let user;

        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;


        try {
            const decoded = jwt.verify(token, config.auth.jwtSecret);
            email = decoded.email;
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'Invalid or expired link. Please try again.' });
        }

        try {
            user = await UsersService.getUserByEmail(email);
        } catch (error) {
            return AuthController.restorePasswordView(req, res, { error: 'User not found' });
        }
    
        if (newPassword !== confirmPassword) {
            return AuthController.createNewPasswordView(req, res, { error: 'Passwords do not match' });
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