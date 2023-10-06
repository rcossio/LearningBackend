import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


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
  },
  owner: {
    type: String, //email
    default: 'admin'
  }
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;
