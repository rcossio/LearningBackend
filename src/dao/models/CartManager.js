import mongoose from 'mongoose';
import {MONGO_ATLAS_CONNECTION_STRING} from '../../utils/contextVars.js' 

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
  }
});

const CartModel = mongoose.model('carts', cartSchema);

class CartManager {
  constructor() {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity, productManager) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error(`Cart not found. Requested ID: ${cartId}`);
      }

      const product = await productManager.getProductById(productId);
      if (!product) {
        throw new Error(`Product not found. Requested ID: ${productId}`);
      }

      const existingProductIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId) //.populate('products.productId')
      if (!cart) {
        throw new Error(`Cart not found. Requested ID: ${cartId}`);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      await CartModel.findByIdAndDelete(cartId);
    } catch (error) {
      throw error;
    }
  }
}

export default CartManager;
