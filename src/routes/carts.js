import {Router} from 'express';
import {productManager} from '../config/config.js';
import {cartManager} from '../config/config.js';

const router = Router();

router.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCartById(cartId);
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).send({ status: 'error', payload: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  }
});

router.post('/:cartId/product/:productId', async (req, res) => {
  
  const { cartId, productId } = req.params;
  try {
    await cartManager.addProductToCart(cartId, productId, 1, productManager);
    res.status(200).json({ status: 'success', payload: 'Product added to cart successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  }
});

router.delete('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    await cartManager.deleteCart(cartId);
    res.status(200).json({ status: 'success', payload: 'Cart deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  }
});

export {router};