import * as dotenv from 'dotenv';

dotenv.config({
    path: `.env.${ process.env.NODE_ENV || 'developement' }.local`
});

export const {
    NODE_ENV,
    PORT,
    API_VERSION,
    DB_ATLAS_USER,
    DB_ATLAS_PASSWD,
    DB_ATLAS_DOMAIN,
    DB_ATLAS_NAME,
    SESSION_SECRET,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET
} = process.env;