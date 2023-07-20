import 'dotenv/config';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_URL}/${process.env.ATLAS_DBNAME}`;

export {MONGO_ATLAS_CONNECTION_STRING};
