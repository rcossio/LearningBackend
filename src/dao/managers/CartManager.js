import CartModel from '../models/CartModel.js';

class CartManager {
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

      const product = await productManager.getProductById(productId);

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
