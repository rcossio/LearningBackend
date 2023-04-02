import * as mongoose from 'mongoose';

const collectionName = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
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
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const userModel = mongoose.model(collectionName, userSchema);

export default userModel;