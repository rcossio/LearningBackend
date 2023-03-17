import * as dotenv from 'dotenv';

dotenv.config({
    path: `.env.${ process.env.NODE_ENV || 'developement' }.local`
});

export const {
    NODE_ENV,
    PORT,
    API_VERSION,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;