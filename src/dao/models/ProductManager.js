import mongoose from 'mongoose';
import {MONGO_ATLAS_CONNECTION_STRING} from '../../utils/contextVars.js' 

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, default: true },
  category: { type: String, required: true },
  thumbnails: { type: Array, default: [] }
});

const Product = mongoose.model('Product', productSchema);

class ProductManager {
  constructor() {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async addProduct(product) {
    try {
      await Product.create(product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error(`Product not found. Requested ID:${id}`);
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, product) {
    try {
      await Product.findByIdAndUpdate(id, product);
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;
