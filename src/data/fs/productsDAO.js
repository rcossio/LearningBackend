import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const __dirname = path.resolve();

class ProductDAO {
  #products = [];
  #path = '';

  constructor(path = `${__dirname}/src/data/fs/products_fs.json`) {
    this.#setPath(path);
  }

  #setPath(path) {
    this.#path = path;
    if (fs.existsSync(this.#path)) {
      this.#loadProducts();
    } else {
      this.#saveFile();

      // Adding a test product.
      this.addProduct({
        title: "Test Product",
        description: "This is a test product.",
        price: 0.00,
        thumbnails: [],
        code: "TEST-PROD",
        stock: 100,
        category: "Test",
        status: true
      });
    }
  }

  async #loadProducts() {
    try {
      const content = await fs.promises.readFile(this.#path, 'utf-8');
      this.#products = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  async #saveFile() {
    const content = JSON.stringify(this.#products);
    try {
      await fs.promises.writeFile(this.#path, content);
    } catch (error) {
      throw error;
    }
  }

  #isProductValid(product) {
    return (
      product &&
      typeof product.title === 'string' &&
      typeof product.description === 'string' &&
      typeof product.price === 'number' &&
      product.price >= 0 &&
      Array.isArray(product.thumbnails) &&
      typeof product.code === 'string' &&
      typeof product.stock === 'number' &&
      product.stock >= 0 &&
      typeof product.category === 'string' &&   // Added category validation
      typeof product.status === 'boolean'      // Added status validation
    );
  }

  #isProductCodeDuplicate(code) {
    return this.#products.some((product) => product.code === code);
  }

  #generateProductId() {
    return uuidv4();
  }

  async addProduct(product) {
    if (!this.#isProductValid(product)) {
      throw new CustomError('Invalid product', 'INVALID_DATA');
    }
    await this.#loadProducts();
    if (this.#isProductCodeDuplicate(product.code)) {
      throw new CustomError('Product with the same code already exists', 'INVALID_DATA');
    }
    const _id = this.#generateProductId();
    const newProduct = { _id, ...product };
    this.#products.push(newProduct);
    await this.#saveFile();
    return newProduct;
  }

  async getProducts(filter = {}, options = {}) {
    await this.#loadProducts();
    return this.#products;
  }

  async getProductById(_id) {
    await this.#loadProducts();
    const product = this.#products.find((p) => p._id === _id);
    if (!product) {
      throw new CustomError(`Product not found. Requested ID:${_id}`, 'QUERY_ERROR');
    }
    return product;
  }

  async deleteProduct(_id) {
    await this.#loadProducts();
    const productIndex = this.#products.findIndex((p) => p._id === _id);
    if (productIndex === -1) {
      throw new CustomError(`Product not found. Requested ID:${_id}`, 'QUERY_ERROR');
    }
    this.#products.splice(productIndex, 1);
    await this.#saveFile();
    return { message: 'Product successfully deleted.' };
  }

  async updateProduct(_id, product) {
    if (!this.#isProductValid(product)) {
      throw new CustomError('Invalid product', 'INVALID_DATA');
    }
    await this.#loadProducts();
    const productIndex = this.#products.findIndex((p) => p._id === _id);
    if (productIndex === -1) {
      throw new CustomError(`Product not found. Requested ID:${_id}`,'QUERY_ERROR');
    }
    const updatedProduct = { _id, ...product };
    this.#products[productIndex] = updatedProduct;
    await this.#saveFile();
    return updatedProduct;
  }
}

export default ProductDAO;
