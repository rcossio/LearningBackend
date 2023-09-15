import ProductModel from '../models/ProductModel.js';

class ProductDAO {

  static #instance;

  constructor() {
    if (ProductDAO.#instance) {
      return ProductDAO.#instance;
    }
    ProductDAO.#instance = this; // If no instance exists, assign this instance to the static field
  }

  static getInstance() {
    if (!ProductDAO.#instance) {
      ProductDAO.#instance = new ProductDAO();
    }
    return ProductDAO.#instance;
  }

  async addProduct(product) {
    return await ProductModel.create(product);
  }

  async getProducts(filter = {}, options = {}) {
    const result = await ProductModel.paginate(filter, options);

    if (result.docs.length === 0) {
      throw new Error('No products found.');
    }

    return result;
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();

    if (!product) {
      throw new Error('Product not found.');
    }

    return product;
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error('Product not found. Unable to delete.');
    }
  }

  async updateProduct(id, product) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true });

    if (!updatedProduct) {
      throw new Error('Product not found. Unable to update.');
    }
  }
}
const productDAOInstance = new ProductDAO();
export default productDAOInstance;
