import mongoose from 'mongoose';
import {MONGO_ATLAS_CONNECTION_STRING} from '../../utils/contextVars.js' 

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  stock: { 
    type: Number, 
    default: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  status: {
    type: Boolean,
    default: true
  },
  thumbnails: { 
    type: Array, 
    default: [] 
  }
});

const ProductModel = mongoose.model('products', productSchema);

class ProductManager {
  constructor() {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

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
