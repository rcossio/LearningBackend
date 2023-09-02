import { Router } from "express";
import bcrypt from 'bcrypt';
import passport from '../config/passportConfig.js';
import {  userManager } from "../config/config.js";


const router = Router();

// Registration
router.get("/register", async (req, res) => {
  if (req.user) {
    return res.redirect('/profile');
  }
  
  res.render('register');
});

router.post("/register", passport.authenticate('signupStrategy', {
  successRedirect: '/auth/registered-successfully',
  failureRedirect: '/auth/registered-failed',
}));

router.get("/registered-successfully", async (req, res) => {
  res.render('login', { message: 'User registered successfully. Please log in' });
});

router.get("/registered-failed", async (req, res) => {
  return res.render('register', { error: 'Unable to register user.' });
});


// Login
router.get("/login", async (req, res) => {
  try{
    if (req.user) {
      return res.redirect('/profile');
    }
  
    res.render('login');
  } catch (error) {
    console.log(error.message)
    res.render('login',{ error: 'Unable to log in' });

  }

});

router.post("/login", passport.authenticate('loginStrategy', {
  successRedirect: '/',
  failureRedirect: '/auth/login-failed',
}));

router.get("/login-failed", async (req, res) => {
  return res.render('login', { error: 'Unable to log in' });
});

//Github auth
router.get("/github", passport.authenticate('githubStrategy'));

router.get("/github/callback", passport.authenticate('githubStrategy', {
  successRedirect: '/',
  failureRedirect: '/login-failed',
}));

//Google auth
router.get("/google", passport.authenticate('googleStrategy',{ scope: ['profile','email'] }));

router.get("/google/callback", passport.authenticate('googleStrategy', {
  successRedirect: '/',
  failureRedirect: '/login-failed',
}));


// Logout
router.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.render('profile', { error: 'Unable to log out' });
    } else {
      return res.redirect('/');
    }
  });
});


// Restore password
router.get("/restore-password", (req, res) => {
  res.render('restore-password');
});

router.post("/restore-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.render('restore-password', { error: 'Password was not updatedPassword was not updated.' });
    }

    if (newPassword !== confirmPassword) {
      return res.render('restore-password', { error: 'Passwords do not match!' });
    }

    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds).then( async (hashedPassword) => {
        await userManager.setUserPasswordByEmail(email, hashedPassword);
        res.status(200).render('login', { message: 'Password updated successfully. Please log in with your new password.' });
    });

  } catch (error) {
    console.error(error.message);
    res.render('restore-password', { error: 'You password could not be restores' });
  }
});

export { router };