import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CustomError from '../../services/customError.js';

const __dirname = path.resolve();

class ProductDAO {
  static #products = [];
  static #path = '';

  constructor(path = `${__dirname}/src/data/fs/products_fs.json`) {
    ProductDAO.#setPath(path);
  }

  static #setPath(path) {
    ProductDAO.#path = path;
    if (fs.existsSync(ProductDAO.#path)) {
      ProductDAO.#loadProducts();
    } else {
      ProductDAO.#saveFile();
    }
  }

  static async #loadProducts() {
    try {
      const content = await fs.promises.readFile(ProductDAO.#path, 'utf-8');
      ProductDAO.#products = JSON.parse(content);
    } catch (error) {
      throw new CustomError(`Could not load products File. ${error.message} `,'FILESYSYEM_ERROR');
    }
  }

  static async #saveFile() {
    const content = JSON.stringify(ProductDAO.#products);
    try {
      await fs.promises.writeFile(ProductDAO.#path, content);
    } catch (error) {
      throw new CustomError(`Could not save products File. ${error.message} `,'FILESYSYEM_ERROR');
    }
  }

  static #isProductValid(product) { //TODO: ProductDAO validation could be in the service layer

    const allowedKeys = [ 'title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category', 'status' ];
    const productKeys = Object.keys(product);
    const hasOnlyAllowedKeys = productKeys.length === allowedKeys.length && 
                               productKeys.every(key => allowedKeys.includes(key));

    return (
      product &&
      hasOnlyAllowedKeys &&
      typeof product.title === 'string' &&
      typeof product.description === 'string' &&
      typeof product.price === 'number' &&
      product.price >= 0.1 &&
      Array.isArray(product.thumbnails) &&
      typeof product.code === 'string' &&
      typeof product.stock === 'number' &&
      Number.isInteger(product.stock) &&
      product.stock >= 0 &&
      typeof product.category === 'string' &&
      typeof product.status === 'boolean'
    );
  }

  static #isProductCodeDuplicate(code) {
    return ProductDAO.#products.some((product) => product.code === code);
  }

  static #generateProductId() {
    return uuidv4();
  }

  static async addProduct(product) {
    if (!ProductDAO.#isProductValid(product)) {
      throw new CustomError('Invalid product', 'INVALID_DATA');
    }
    await ProductDAO.#loadProducts();
    if (ProductDAO.#isProductCodeDuplicate(product.code)) {
      throw new CustomError('Product with the same code already exists', 'INVALID_DATA');
    }
    const _id = ProductDAO.#generateProductId();
    const owner = 'admin';
    const newProduct = { _id, ...product, owner };
    ProductDAO.#products.push(newProduct);
    await ProductDAO.#saveFile();
    return newProduct;
  }

  static async getProducts(filter = {}, options = {}) { // filters and aptions are not implemented in FS
    await ProductDAO.#loadProducts();
    return ProductDAO.#products;
  }

  static async getProductById(_id) {
    await ProductDAO.#loadProducts();
    const product = ProductDAO.#products.find((p) => p._id === _id);
    if (!product) {
      throw new CustomError(`Product not found. Requested ID:${_id}`, 'QUERY_ERROR');
    }
    return product;
  }

  static async updateProduct(_id, product) {
    if (!ProductDAO.#isProductValid(product)) {
      throw new CustomError('Invalid product', 'INVALID_DATA');
    }
    await ProductDAO.#loadProducts();
    const productIndex = ProductDAO.#products.findIndex((p) => p._id === _id);
    if (productIndex === -1) {
      throw new CustomError(`Product not found. Requested ID:${_id}`,'QUERY_ERROR');
    }
    const updatedProduct = { _id, ...product };
    ProductDAO.#products[productIndex] = updatedProduct;
    await ProductDAO.#saveFile();
    return updatedProduct;
  }

  static async deleteProduct(_id) {
    await ProductDAO.#loadProducts();
    const productIndex = ProductDAO.#products.findIndex((p) => p._id === _id);
    if (productIndex === -1) {
      throw new CustomError(`Product not found. Requested ID:${_id}`, 'QUERY_ERROR');
    }
    const product = ProductDAO.#products[productIndex];
    ProductDAO.#products.splice(productIndex, 1);
    await ProductDAO.#saveFile();
    return product;
  }
}

export default ProductDAO;
