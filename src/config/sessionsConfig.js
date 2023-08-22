import MongoStore from 'connect-mongo';
import session from 'express-session';
import 'dotenv/config';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_URL}/${process.env.ATLAS_DBNAME}`;

const sessionStore = MongoStore.create({
  mongoUrl: MONGO_ATLAS_CONNECTION_STRING,
  collectionName: 'sessions', 
  ttl:  60
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY, 
  resave: false,              // Obs.: Do not force session to be saved back to session store if it didn't change
  saveUninitialized: false,   // Obs: Do not save uninitialized sessions (sessions with no data)
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60,  //  1 min expiration in milliseconds
    httpOnly: true
  }
})

export default sessionMiddleware;