import fs from 'fs';

class ProductManager {
  #products = [];
  #lastId = 0;
  #path = '';

  constructor(path) {
    try {
      this.#setPath(path);
    } catch (error) {
      throw error;
    }
  }

  #setPath(path) {
    this.#path = path;
    if (fs.existsSync(this.#path)) {
      this.#loadProducts();
    } else {
      this.#saveFile();
    }
  }

  async #loadProducts() {
    try {
      const content = await fs.promises.readFile(this.#path, 'utf-8');
      const { products, lastId } = JSON.parse(content);
      this.#products = products;
      this.#lastId = lastId;
    } catch (error) {
      throw error;
    }
  }

  async #saveFile() {
    const content = JSON.stringify({ products: this.#products, lastId: this.#lastId });
    try {
      await fs.promises.writeFile(this.#path, content);
    } catch (error) {
      throw error;
    }
  }

  #isProductValid(product) {
    return (
      product &&
      typeof product.id === 'undefined' &&
      typeof product.title === 'string' &&
      typeof product.description === 'string' &&
      typeof product.price === 'number' &&
      product.price >= 0 &&
      Array.isArray(product.thumbnails) &&
      typeof product.code === 'string' &&
      typeof product.stock === 'number' &&
      product.stock >= 0
    );
  }

  #isProductCodeDuplicate(code) {
    return this.#products.some((product) => product.code === code);
  }

  #generateProductId() {
    return ++this.#lastId;
  }

  async addProduct(product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    await this.#loadProducts();

    if (this.#isProductCodeDuplicate(product.code)) {
      throw new Error('Product with the same code already exists');
    }

    const id = this.#generateProductId();
    const newProduct = { id, ...product };
    this.#products.push(newProduct);

    await this.#saveFile();
  }

  async getProducts() {
    await this.#loadProducts();
    return this.#products;
  }

  async getProductById(id) {
    await this.#loadProducts();

    const product = this.#products.find((p) => p.id === id);

    if (!product) {
      throw new Error(`Product not found. Requested ID:${id}`);
    }

    return product;
  }

  async deleteProduct(id) {
    await this.#loadProducts();

    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error(`Product not found. Requested ID:${id}`);
    }

    this.#products.splice(productIndex, 1);

    await this.#saveFile();
  }

  async updateProduct(id, product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    await this.#loadProducts();

    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error(`Product not found. Requested ID:${id}`);
    }

    const updatedProduct = { id, ...product };
    this.#products[productIndex] = updatedProduct;

    await this.#saveFile();
  }
}

export default ProductManager;
