import {Router} from 'express';
import CartManager from '../controllers/CartManager.js';

const router = Router();

const CART_DATA_FILE = './src/data/carts.json';
const cartManager = new CartManager(CART_DATA_FILE);

router.get('/:cartId', (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = cartManager.getCartById(Number(cartId));
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post('/', (req, res) => {
  try {
    const cart = cartManager.createCart();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.put('/:cartId/product/:productId', (req, res) => {
  const { cartId, productId } = req.params;
  try {
    cartManager.addProductToCart(Number(cartId), productId, 1);
    res.json({ status: 'success', payload: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

router.delete('/:cartId', (req, res) => {
  const { cartId } = req.params;
  try {
    cartManager.deleteCart(Number(cartId));
    res.json({ status: 'success', payload: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: error.message });
  }
});

export {router};