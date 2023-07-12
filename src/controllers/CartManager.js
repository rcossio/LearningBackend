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

  #loadCarts() {
    try {
      const content = fs.readFileSync(this.#path, 'utf-8');
      const { carts, lastId } = JSON.parse(content);
      this.#carts = carts;
      this.#lastId = lastId;
    } catch (error) {
      console.error('Error loading file:', error);
    }
  }

  #saveFile() {
    const content = JSON.stringify({ carts: this.#carts, lastId: this.#lastId });
    try {
      fs.writeFileSync(this.#path, content);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  #generateCartId() {
    return ++this.#lastId;
  }

  createCart() {
    const id = this.#generateCartId();
    const newCart = { id, products: [] };
    this.#carts.push(newCart);

    this.#saveFile();
    return newCart;
  }

  addProductToCart(cartId, productId, quantity) {
    this.#loadCarts();
  
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
  
    this.#saveFile();
  }

  getCartById(cartId) {
    this.#loadCarts();

    const cart = this.#carts.find((cart) => cart.id === cartId);

    if (!cart) {
      throw new Error(`Cart not found. Requested ID: ${cartId}`);
    }

    return cart;
  }

  deleteCart(cartId) {
    this.#loadCarts();

    const cartIndex = this.#carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
      throw new Error('Cart not found');
    }

    this.#carts.splice(cartIndex, 1);

    this.#saveFile();
  }
}

export default CartManager;
