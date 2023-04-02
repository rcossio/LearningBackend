import passport from 'passport';
import { Strategy as GitHubStrategy } from "passport-github2";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT } from "../config/config.js";
import userModel from '../models/users.model.js';

function configurePassport() {

    passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}/auth/github/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                const newUserObj = { 
                    firstName: profile._json.name,
                    lastName: profile.username,
                    email: profile._json.email, 
                    age: 0,
                    password: '',
                    role: 'user'
                };
                const newUser = await userModel.create(newUserObj);
                return done(null, newUser);
            }
            return done(null, user);

        } catch (error) {
            return done(error)
        }
      }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
      
    passport.deserializeUser( async (id, done) => {
        const user = await userModel.findById({ _id: id});
        done(err, user)
    });
}

export default configurePassport;
