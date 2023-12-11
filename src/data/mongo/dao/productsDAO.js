import ProductModel from '../models/ProductModel.js';
import CustomError from '../../../services/customError.js';

class ProductDAO {

  static async addProduct(product) {
    try {
      const product = await ProductModel.create(product);
      return product;
    } catch (err) {
      throw new CustomError('Unable to add product.','UNKNOWN_ERROR');
    }
  }

  static async getProducts(filter = {}, options = {}) {
    const result = await ProductModel.paginate(filter, options);
    if (!result) {
      throw new CustomError('No products found.','UNKNOWN_ERROR');
    }
    return result;
  }

  static async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) {
      throw new CustomError(`Product not found ID ${id}`,'QUERY_ERROR')
    }
    return product;
  }

  static async updateProduct(id, product) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
      throw new CustomError('Unable to update.','UNKNOWN_ERROR');
    } 
    return updatedProduct;
  }

  static async deleteProduct(id) {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw new CustomError(`Product not found ID ${id}`,'QUERY_ERROR')
    }
    return product;
  }
}

export default ProductDAO;
