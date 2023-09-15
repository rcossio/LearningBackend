import { getUserByEmail, setUserPasswordByEmail } from '../services/auth.js';

async function registerView(req, res) {
    if (req.user) {
        return res.redirect('/profile');
    }
    res.render('register');
}

async function registrationSuccessView(req, res) {
    res.render('login', { message: 'User registered successfully. Please log in' });
}

async function registrationFailedView(req, res) {
    return res.render('register', { error: 'Unable to register user.' });
}

async function loginView(req, res) {
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

async function loginFailedView(req, res) {
    return res.render('login', { error: 'Unable to log in' });
}

async function logout(req, res) {
    req.logout((error) => {
        if (error) {
            return res.render('profile', { error: 'Unable to log out' });
        } else {
            return res.redirect('/');
        }
    });
}

async function restorePasswordView(req, res) {
    res.render('restore-password');
}

async function restorePassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.render('restore-password', { error: 'Password was not updatedPassword was not updated.' });
        }

        if (newPassword !== confirmPassword) {
            return res.render('restore-password', { error: 'Passwords do not match!' });
        }

        await setUserPasswordByEmail(email, newPassword);
        res.status(200).render('login', { message: 'Password updated successfully. Please log in with your new password.' });
    } catch (error) {
        console.error(error.message);
        res.render('restore-password', { error: 'Your password could not be restored' });
    }
}

const authController = {
    registerView,
    registrationSuccessView,
    registrationFailedView,
    loginView,
    loginFailedView,
    logout,
    restorePasswordView,
    restorePassword
}

export default authController;
