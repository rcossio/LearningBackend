import { Router } from 'express';
import CartsController from '../controllers/carts.js';

const router = Router();

router.post('/', CartsController.createCart);
router.get('/:cartId([0-9a-fA-F]{24})', CartsController.getCartById);
router.put('/:cartId([0-9a-fA-F]{24})', CartsController.updateCart);
router.delete('/:cartId([0-9a-fA-F]{24})', CartsController.deleteCart);
router.post('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.addProductToCart);
router.put('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.updateProductInCart);
router.delete('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.deleteProductFromCart);

export { router };
