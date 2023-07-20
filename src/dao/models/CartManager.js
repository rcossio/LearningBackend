import mongoose from 'mongoose';
import {MONGO_ATLAS_CONNECTION_STRING} from '../../utils/contextVars.js' 

const cartSchema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }]
});

const Cart = mongoose.model('Cart', cartSchema);

class CartManager {
  constructor() {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity, productManager) {
    try {
      const cart = await Cart.findById(cartId);
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
      const cart = await Cart.findById(cartId).populate('products.productId');
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
      await Cart.findByIdAndDelete(cartId);
    } catch (error) {
      throw error;
    }
  }
}

export default CartManager;
