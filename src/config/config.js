
import dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'developement'

dotenv.config({
  path: path.join(path.resolve(), `.env.${mode}`)
});

const config = {
  server : {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost'
  },
  session: {
    secret: process.env.SESSION_SECRET_KEY,
  },
  db : {
    user: process.env.ATLAS_USER,
    pass: process.env.ATLAS_PASS,
    url: process.env.ATLAS_URL,
    dbName: process.env.ATLAS_DBNAME
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS
  },

  auth: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      secretKey: process.env.AUTH_GITHUB_SECRET_KEY,
      callbackUrl: process.env.AUTH_GITHUB_CALLBACK_URL
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      secretKey: process.env.AUTH_GOOGLE_SECRET_KEY,
      callbackUrl: process.env.AUTH_GOOGLE_CALLBACK_URL
    }
  }
}

export {
  config
};



