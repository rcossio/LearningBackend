import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_URL}/${process.env.ATLAS_DBNAME}`;

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