import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_ATLAS_CONNECTION_STRING = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_URL}/${process.env.ATLAS_DBNAME}`;

const connectDB = async () => {
  try {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected successfully');
  } catch (error) {
    throw error;
  }

};

export default connectDB;