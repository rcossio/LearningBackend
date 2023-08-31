import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: {
    type: [{
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'products',
        required: true
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 1,
        default: 1
      }
    }],
    required: true,
    default: []
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users',
    required: false //for API retrocompatibility
  }
});

const CartModel = mongoose.model('carts', cartSchema);

export default CartModel;