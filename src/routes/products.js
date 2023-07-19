import {Router} from 'express';
import {productManager} from '../utils/contextVars.js';

const router = Router();

router.get('/', async (req, res) => {
  const {limit} = req.query;
  try {
    const products = await productManager.getProducts();
    res.json({ status: 'success', payload: products.slice(0, limit?? 10) });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  const {productId} = req.params;
  try {
    const product = await productManager.getProductById(Number(productId));
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  } 
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
      await productManager.deleteProduct(Number(productId));
      res.json({ status: 'success', payload: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.post('/', async (req, res) => {
  const product = req.body;
  try {
      await productManager.addProduct(product);
      res.json({ status: 'success', payload: 'Product added successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = req.body;
  try {
      await productManager.updateProduct(Number(productId), product);
      res.json({ status: 'success', payload: 'Product updated successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', payload: error.message });
  }
});

export {router};
