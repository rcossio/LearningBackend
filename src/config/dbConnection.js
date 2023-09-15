import mongoose from 'mongoose';
import { config } from './config.js';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.url}/${config.db.dbName}`;

const connectDB = async () => {
  try {
    mongoose.set('bufferTimeoutMS', 5000) //5 seconds
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000   //5 seconds
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database');
  }

};

export default connectDB;