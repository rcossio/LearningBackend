import fs from 'fs';

class ProductManager {
  #products = [];
  #lastId = 0;

  constructor() {
    // Not really used but just to show that we can have a constructor as it is asked in the exercise
    console.info('ProductManager instance created');
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

  addProduct(product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    if (this.#isProductCodeDuplicate(product.code)) {
      throw new Error('Product with the same code already exists'); 
    }

    const id = this.#generateProductId();
    const newProduct = { id, ...product };
    this.#products.push(newProduct);
    console.info(`Product with id ${id} has been added`) 
  }

  getProducts() {
    return this.#products;
  }

  getProductById(id) {
    const product = this.#products.find((p) => p.id === id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  deleteProduct(id) {
    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    this.#products.splice(productIndex, 1); //Alt: this.#products = this.#products.filter((p) => p.id !== id);
    console.info(`Product with id ${id} has been deleted`) 

  }

  updateProduct(id, product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = { id, ...product };
    this.#products[productIndex] = updatedProduct;

    console.info(`Product with id ${id} has been updated`) 

  }
}

export default ProductManager;