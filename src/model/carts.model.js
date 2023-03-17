import * as mongoose from 'mongoose';

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    productsArray: {type : Array, required: true},
})

const cartModel = mongoose.model(collectionName, cartSchema);

export default cartModel;