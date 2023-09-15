import CartModel from '../models/CartModel.js';

class CartDAO {

  static #instance;

  constructor() {
    if (CartDAO.#instance) {
      return CartDAO.#instance;
    }
    CartDAO.#instance = this; // If no instance exists, assign this instance to the static field
  }

  static getInstance() {
    if (!CartDAO.#instance) {
      CartDAO.#instance = new CartDAO();
    }
    return CartDAO.#instance;
  }

  async createCart() {
    return await CartModel.create({ products: [] });
  }

  async addProductToCart(cartId, productId, quantity, productDAO) {
    const cart = await CartModel.findById(cartId);

    const product = await productDAO.getProductById(productId);

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
  }

  async addProductToUserCart(userId, productId, quantity, productDAO) {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const product = await productDAO.getProductById(productId);

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
  }

  async updateProductInCart(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
    } else {
      throw new Error('Product not found in cart.');
    }
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId); 
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
    } else {
      throw new Error('Product not found in cart.');
    }
  }

  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate('products.productId').lean();
  }

  async updateCart(cartId, products) {
    const cart = await CartModel.findById(cartId);
    cart.products = products;
    await cart.save();
  }

  async deleteCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found.');
    }
    cart.products = [];
    await cart.save();
  }
}

const cartDAOInstance = new CartDAO();
export default cartDAOInstance;
