import fs from 'fs';

class CartManager {
  #carts = [];
  #lastId = 0;
  #path = '';

  constructor(path) {
    try {
      this.#setPath(path);
    } catch (error) {
      console.error('Error setting path:', error);
    }
  }

  #setPath(path) {
    this.#path = path;
    if (fs.existsSync(this.#path)) {
      this.#loadCarts();
    } else {
      this.#saveFile();
    }
  }

  async #loadCarts() {
    try {
      const content = await fs.promises.readFile(this.#path, 'utf-8');
      const { carts, lastId } = JSON.parse(content);
      this.#carts = carts;
      this.#lastId = lastId;
    } catch (error) {
      console.error('Error loading file:', error);
    }
  }

  async #saveFile() {
    const content = JSON.stringify({ carts: this.#carts, lastId: this.#lastId });
    try {
      await fs.promises.writeFile(this.#path, content);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  #generateCartId() {
    return ++this.#lastId;
  }

  async createCart() {
    const id = this.#generateCartId();
    const newCart = { id, products: [] };
    this.#carts.push(newCart);

    await this.#saveFile();
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    await this.#loadCarts();
  
    const cartIndex = this.#carts.findIndex((cart) => cart.id === cartId);
  
    if (cartIndex === -1) {
      throw new Error('Cart not found');
    }
  
    const cart = this.#carts[cartIndex];
    const existingProductIndex = cart.products.findIndex((product) => product.productId === productId);
  
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productId, quantity });
    }
  
    await this.#saveFile();
  }

  async getCartById(cartId) {
    await this.#loadCarts();

    const cart = this.#carts.find((cart) => cart.id === cartId);

    if (!cart) {
      throw new Error(`Cart not found. Requested ID: ${cartId}`);
    }

    return cart;
  }

  async deleteCart(cartId) {
    await this.#loadCarts();

    const cartIndex = this.#carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
      throw new Error('Cart not found');
    }

    this.#carts.splice(cartIndex, 1);

    await this.#saveFile();
  }
}

export default CartManager;
