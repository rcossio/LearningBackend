import * as mongoose from 'mongoose';

const collectionName = 'products';

const productSchema = new mongoose.Schema({
    title: {type : String, required: true},
    description: {type : String, required: true},
    price: {type : Number, required: true},
    thumbnail: {type : Array, required: true},
    code: {type : String, required: true, unique: true},
    stock: {type : Number, required: true},
    category: {type : String, required: true, 
            enum: ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Office', 'Garden', 'Other'] 
        },
    status: {type : Boolean, required: true},
})

const productModel = mongoose.model(collectionName, productSchema);

export default productModel;