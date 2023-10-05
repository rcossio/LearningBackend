import mongoose from 'mongoose';
import { config } from './config.js';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.url}/${config.db.dbName}`;

const connectDB = async () => {
  try {
    mongoose.set('bufferTimeoutMS', 3000) //3 seconds
    await mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 3000   //3 seconds
    })
  } catch {
    console.error('Error connecting to DB')
  }
};

export default connectDB;