import * as mongoose from 'mongoose';

const collectionName = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: { 
        type: Number
    },
    password: {
        type: String,
        required: true,
    }
})

const userModel = mongoose.model(collectionName, userSchema);

export default userModel;