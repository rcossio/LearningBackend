import {Router} from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = Router();

const PRODUCT_DATA_FILE = './src/data/products.json';
const productManager = new ProductManager(PRODUCT_DATA_FILE);

router.get('/', (req, res) => {
  const {limit} = req.query;
  try {
    const products = productManager.getProducts().slice(0, limit?? 10);
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.get('/:productId', (req, res) => {
  const {productId} = req.params;
  try {
    const product = productManager.getProductById(Number(productId));
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  } 
});

router.delete('/:productId', (req, res) => {
  const { productId } = req.params;
  try {
      productManager.deleteProduct(Number(productId));
      res.json({ status: 'success', payload: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.post('/', (req, res) => {
  const product = req.body;
  try {
      productManager.addProduct(product);
      res.json({ status: 'success', payload: 'Product added successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.put('/:productId', (req, res) => {
  const { productId } = req.params;
  const product = req.body;
  try {
      productManager.updateProduct(Number(productId), product);
      res.json({ status: 'success', payload: 'Product updated successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

export {router};