import ProductModel from '../models/ProductModel.js';

class ProductDAO {

  static async addProduct(product) {
    return await ProductModel.create(product);
  }

  static async getProducts(filter = {}, options = {}) {
    return await ProductModel.paginate(filter, options);
  }

  static async getProductById(id) {
    return await ProductModel.findById(id).lean();
  }

  static async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  static async updateProduct(id, product) {
    return await ProductModel.findByIdAndUpdate(id, product, { new: true });
  }
}

export default ProductDAO;
