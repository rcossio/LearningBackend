import {Router} from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const PRODUCT_DATA_FILE = './src/data/products.json';
const CART_DATA_FILE = './src/data/carts.json';

const cartManager = new CartManager(CART_DATA_FILE);
const productManager = new ProductManager(PRODUCT_DATA_FILE);

router.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCartById(Number(cartId));
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.post('/:cartId/product/:productId', async (req, res) => {
  
  const { cartId, productId } = req.params;
  try {
    await cartManager.addProductToCart(Number(cartId), productId, 1, productManager);
    res.json({ status: 'success', payload: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.delete('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    await cartManager.deleteCart(Number(cartId));
    res.json({ status: 'success', payload: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

export {router};