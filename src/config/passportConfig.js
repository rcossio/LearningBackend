import passport from 'passport';
import { config } from './config.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UsersService from '../services/users.js';

passport.use('signupStrategy', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const user = await UsersService.registerUser(req, email, password);
            return done(null, user);
        } catch (err) {
            return done(null, false, { message: err.message });
        }
    }
));

passport.use('loginStrategy', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await UsersService.loginUser(email, password);
            return done(null, user);
        } catch (err) {
            return done(null, false, { message: err.message });
        }
    }
));

passport.use('githubStrategy', new GitHubStrategy(
    {
        clientID: config.auth.github.clientId,
        clientSecret: config.auth.github.secretKey,
        callbackURL: config.auth.github.callbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await UsersService.githubAuth(profile);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.use('googleStrategy', new GoogleStrategy(
    {
        clientID: config.auth.google.clientId,
        clientSecret: config.auth.google.secretKey,
        callbackURL: config.auth.google.callbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await UsersService.googleAuth(profile);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    if (user.email === config.admin.email) {
        done(null, user.email);
    } else {
        done(null, user._id);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        if (id === config.admin.email) {
            return done(null, {
                firstName: 'Admin',
                lastName: 'Admin',
                email: config.admin.email,
                role: 'admin'
            });
        }

        const user = await UsersService.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
