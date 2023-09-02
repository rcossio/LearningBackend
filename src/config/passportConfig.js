import passport from 'passport';
import bcrypt from 'bcrypt';
import { userManager } from './config.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use('signupStrategy', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    async (req, email, password, done) => {
        try {
            const existingUser = await userManager.getUserByEmail(email);
            if (existingUser) {
                return done(null, false, { message: 'User already exists.' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                age: req.body.age,
                password: hashedPassword
            };
            const user = await userManager.addNewUser(newUser);
            return done(null, user);
        } catch (err) {
            return done(err);
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
            // Admin login check
            if (email.toLowerCase() === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
                const adminUser = {
                    firstName: 'Admin',
                    lastName: 'Admin',
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                };
                return done(null, adminUser);
            }

            const user = await userManager.getUserByEmail(email);
            if (!user) {
                return done(null, false);
            }

            if (user.password === undefined) {
                return done(null, false);
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false);
            }
            
            return done(null, user);
        } catch (err) {
            return done(err);
        }   
    }
));

passport.use('githubStrategy', new GitHubStrategy(
    {
        clientID: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET_KEY,
        callbackURL: process.env.AUTH_GITHUB_CALLBACK_URL
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile)
            const user = await userManager.getUserByEmail(profile.username);
            if (!user) {
                const newUser = {
                    firstName: profile.username,
                    lastName: `(${profile.provider})`,
                    email: profile.username
                }
                const user = await userManager.addNewUser(newUser);
            } 
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


passport.use('googleStrategy', new GoogleStrategy(
    {
        clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET_KEY,
        callbackURL: process.env.AUTH_GOOGLE_CALLBACK_URL
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile)
            const user = await userManager.getUserByEmail(profile.emails[0].value);
            if (!user) {
                const newUser = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value
                }
                const user = await userManager.addNewUser(newUser);
            } 
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


passport.serializeUser((user, done) => {
    // Admin serialization
    if (user.email === process.env.ADMIN_EMAIL) {
        done(null, user.email);
    } else {
        done(null, user._id);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        // Admin deserialization
        if (id === process.env.ADMIN_EMAIL) { 
            return done(null, {
                firstName: 'Admin',
                lastName: 'Admin',
                email: process.env.ADMIN_EMAIL,
                role: 'admin'
            });
        }
        
        const user = await userManager.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
