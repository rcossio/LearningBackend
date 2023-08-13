import ProductModel from '../models/ProductModel.js';

class ProductManager {

  async addProduct(product) {
    try {
      await ProductModel.create(product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find({}).lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, product) {
    try {
      await ProductModel.findByIdAndUpdate(id, product);
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;