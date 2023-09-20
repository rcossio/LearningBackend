import cartDAO from "../data/mongo/dao/cartsDAO.js";
import ProductsService from "./products.js";

class CartService {
  static async getCartById(cartId) {
    return await cartDAO.getCartById(cartId);
  }

  static async getCartRefsById(cartId) {
    return await cartDAO.getCartRefsById(cartId);
  }

  static async addProductToCart(cartId, productId, quantity) {
    const cart = await cartDAO.getCartRefsById(cartId);

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    
    if (productIndex !== -1) {
        quantity += cart.products[productIndex].quantity;
    }
    
    return await this.updateProductQuantity(cartId, productId, quantity);
  }

  static async createCart() {
    return await cartDAO.createCart();
  }

  static async modifyCart(cartId, products) {
    return await cartDAO.updateCart(cartId, products);
  }

  static async removeCart(cartId) {
    await cartDAO.deleteCart(cartId);
  }

  static async addProductToUserCart(userId, productId, quantity = 1) {
    let cart = await cartDAO.findCartByUserId(userId);
    if (!cart) {
      cart = await this.createCart();
    }
    return await this.addProductToCart(cart._id, productId, quantity);
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartDAO.getCartRefsById(cartId);

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex === -1) {
        cart.products.push({ productId, quantity });
    } else {
        cart.products[productIndex].quantity = quantity;
    }

    return await cartDAO.updateCart(cartId, cart.products);
  }

  static async removeProductFromCart(cartId, productId) {
    const cart = await cartDAO.getCartById(cartId);

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex === -1) {
      throw new Error('Product not found in cart.');
    }

    cart.products.splice(productIndex, 1);
    return await cartDAO.updateCart(cartId, cart.products);
  }
}

export default CartService;
