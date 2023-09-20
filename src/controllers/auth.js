import UsersService from '../services/users.js';
import passport from '../config/passportConfig.js';

class AuthController {
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

    static async logout(req, res) {
        req.logout((error) => {
            if (error) {
                return res.render('profile', { error: 'Unable to log out' });
            } else {
                return res.redirect('/');
            }
        });
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
        passport.authenticate('signupStrategy', {
            successRedirect: '/auth/registered-successfully',
            failureRedirect: '/auth/registered-failed',
        })(req, res, next);
    }

    static loginUser(req, res, next) {
        passport.authenticate('loginStrategy', {
            successRedirect: '/',
            failureRedirect: '/auth/login-failed',
        })(req, res, next);
    }

    static githubAuth(req, res, next) {
        passport.authenticate('githubStrategy')(req, res, next);
    }

    static githubAuthCallback(req, res, next) {
        passport.authenticate('githubStrategy', {
            successRedirect: '/',
            failureRedirect: '/login-failed',
        })(req, res, next);
    }

    static googleAuth(req, res, next) {
        passport.authenticate('googleStrategy', { scope: ['profile', 'email'] })(req, res, next);
    }

    static googleAuthCallback(req, res, next) {
        passport.authenticate('googleStrategy', {
            successRedirect: '/',
            failureRedirect: '/login-failed',
        })(req, res, next);
    }
    
}

export default AuthController;