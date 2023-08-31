import MongoStore from 'connect-mongo';
import session from 'express-session';
import 'dotenv/config';
import mongoose from 'mongoose';

let sessionStore;
try {
  if (mongoose.connection.readyState === 1) {
    sessionStore = MongoStore.create(
      {
      client: mongoose.connection.getClient(),
      collectionName: 'sessions', 
      ttl:  300 // 5 min expiration in seconds
      }
    )};
} catch (error) {
  console.error('Error connecting to MongoDB Atlas: ', error);
  sessionStore = null
}

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY, 
  resave: false,              // Obs.: Do not force session to be saved back to session store if it didn't change
  saveUninitialized: false,   // Obs: Do not save uninitialized sessions (sessions with no data)
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60,  //  60 min expiration in milliseconds
    httpOnly: true
  }
})

export default sessionMiddleware;