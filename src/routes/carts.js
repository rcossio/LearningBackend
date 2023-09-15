import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import cartController from '../controllers/carts.js';

const router = Router();

router.post('/', asyncHandler(cartController.createCart));
router.get('/:cartId([0-9a-fA-F]{24})', asyncHandler(cartController.getCartById));
router.put('/:cartId([0-9a-fA-F]{24})', asyncHandler(cartController.updateCart));
router.delete('/:cartId([0-9a-fA-F]{24})', asyncHandler(cartController.deleteCart));
router.post('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', asyncHandler(cartController.addProductToCart));
router.put('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', asyncHandler(cartController.updateProductInCart));
router.delete('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', asyncHandler(cartController.deleteProductFromCart));

export { router };
