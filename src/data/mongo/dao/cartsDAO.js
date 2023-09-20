import CartModel from '../models/CartModel.js';

class CartDAO {
  static async createCart() {
    return await CartModel.create({ products: [] });
  }

  static async getCartById(cartId) {
    return await CartModel.findById(cartId).populate('products.productId').lean();
  }

  static async getCartRefsById(cartId) {
    return await CartModel.findById(cartId).lean();
  }

  static async findCartByUserId(userId) {
    return await CartModel.findOne({ userId }).lean();
  }

  static async updateCart(cartId, products) {
    const cart = await CartModel.findById(cartId);
    cart.products = products;
    await cart.save();
    return cart;
  }

  static async deleteCart(cartId) {
    await CartModel.findByIdAndDelete(cartId);
  }
}

export default CartDAO;
