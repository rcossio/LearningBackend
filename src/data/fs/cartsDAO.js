import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CustomError from '../../services/customError.js';

const __dirname = path.resolve();

class CartDAO {
  static #carts = [];
  static #path = '';

  constructor(path = `${__dirname}/src/data/fs/carts_fs.json`) {
    CartDAO.#setPath(path);
  }

  static #setPath(path) {
    CartDAO.#path = path;
    if (!fs.existsSync(CartDAO.#path)) {
      CartDAO.#saveFile();
    }
  }

  static async #loadCarts() {
    try {
      const content = await fs.promises.readFile(CartDAO.#path, 'utf-8');
      CartDAO.#carts = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  static async #saveFile() {
    const content = JSON.stringify(CartDAO.#carts);
    try {
      await fs.promises.writeFile(CartDAO.#path, content);
    } catch (error) {
      throw error;
    }
  }

  static async createCart() {
    const newCart = {
      _id: uuidv4(),
      products: []
    };
    CartDAO.#carts.push(newCart);
    await CartDAO.#saveFile();
    return newCart;
  }

  static async getCartById(cartId) {
    await CartDAO.#loadCarts();
    const cart = CartDAO.#carts.find(cart => cart._id === cartId);
    if (!cart) {
      throw new CustomError(`Cart not found. Requested ID: ${cartId}`, 'QUERY_ERROR');
    }
    return cart;  //Does not use population-like method
  }

  static async getCartRefsById(cartId) {
    return CartDAO.getCartById(cartId);  // We are not using population
  }

  static async updateCart(cartId, products) {
    await CartDAO.#loadCarts();
    const cartIndex = CartDAO.#carts.findIndex(cart => cart._id === cartId);
    if (cartIndex === -1) {
      throw new CustomError(`Cart not found. Requested ID: ${cartId}`, 'QUERY_ERROR');
    }
    CartDAO.#carts[cartIndex].products = products;
    await CartDAO.#saveFile();
    const cart = CartDAO.#carts[cartIndex];
    return cart;
  }

  static async deleteCart(cartId) {
    await CartDAO.#loadCarts();
    const cartIndex = CartDAO.#carts.findIndex(cart => cart._id === cartId);
    if (cartIndex === -1) {
      throw new CustomError(`Cart not found. Requested ID: ${cartId}`, 'QUERY_ERROR');
    }
    const cart = CartDAO.#carts[cartIndex];
    CartDAO.#carts.splice(cartIndex, 1);
    await CartDAO.#saveFile();
    return cart;
  }
}

export default CartDAO;
