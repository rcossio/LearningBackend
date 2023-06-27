import fs from 'fs';

class ProductManager {
  #products = [];
  #lastId = 0;
  #path = '';

  constructor(path) {
    this.#setPath(path);
    console.info('ProductManager instance created');
  }

  #setPath(path) {
    this.#path = path;
    if ( fs.existsSync(this.#path) ) {
      this.#loadProducts()
    } else{
      this.#saveFile();
    }
  }

  #loadProducts() {
    try {
      const content = fs.readFileSync(this.path,'utf-8')
      const { products, lastId } = JSON.parse(content);
      this.#products = products;
      this.#lastId = lastId;
    } catch (error) {
      console.error('Error loading file:', error);
    }
  }

  #saveFile() {
    const content = JSON.stringify({ products: this.#products, lastId: this.#lastId });
    try {
        fs.writeFileSync(this.#path, content)
    } catch (error){
        console.error('Error saving file:', error)
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

  addProduct(product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    this.#loadProducts();

    if (this.#isProductCodeDuplicate(product.code)) {
      throw new Error('Product with the same code already exists');
    }

    const id = this.#generateProductId();
    const newProduct = { id, ...product };
    this.#products.push(newProduct);

    this.#saveFile();
  }

  getProducts() {
    this.#loadProducts();
    return this.#products;
  }

  getProductById(id) {
    this.#loadProducts();

    const product = this.#products.find((p) => p.id === id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  deleteProduct(id) {
    this.#loadProducts();

    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    this.#products.splice(productIndex, 1); //Alt: this.#products = this.#products.filter((p) => p.id !== id);

    this.#saveFile();
  }

  updateProduct(id, product) {
    if (!this.#isProductValid(product)) {
      throw new Error('Invalid product');
    }

    this.#loadProducts();

    const productIndex = this.#products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = { id, ...product };
    this.#products[productIndex] = updatedProduct;

    this.#saveFile();
  }
}

export default ProductManager;
