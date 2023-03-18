import * as mongoose from 'mongoose';

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type : [
            { 
                product: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'products',
                    required: true,
                },
                quantity: {
                    type: Number,
                    min: 1,
                    default: 1,
                    required: true
                }
            }
        ],
        required: true,
        default: []
    },
})

cartSchema.pre('find', function() {
    this.populate('products.product')
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

const cartModel = mongoose.model(collectionName, cartSchema);
    

export default cartModel;