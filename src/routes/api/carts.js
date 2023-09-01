import { Router } from 'express';
import { productManager, cartManager } from '../../config/config.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router = Router();

router.post('/', asyncHandler(async (req, res) => {
    const cart = await cartManager.createCart();
    res.status(201).json({ status: 'success', payload: cart });
}));

router.get('/:cartId', asyncHandler(async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cartId);
    res.status(200).json({ status: 'success', payload: cart });
}));

router.put('/:cartId', asyncHandler(async (req, res) => {
    await cartManager.updateCart(req.params.cartId, req.body.products);
    res.status(200).json({ status: 'success', payload: 'Cart updated successfully' });
}));

router.delete('/:cartId', asyncHandler(async (req, res) => {
    await cartManager.deleteCart(req.params.cartId);
    res.status(200).end();
}));

router.post('/:cartId/product/:productId', asyncHandler(async (req, res) => {
    await cartManager.addProductToCart(req.params.cartId, req.params.productId, 1, productManager);
    res.status(201).json({ status: 'success', payload: 'Product added to cart successfully' });
}));

router.put('/:cartId/product/:productId', asyncHandler(async (req, res) => {
    await cartManager.updateProductInCart(req.params.cartId, req.params.productId, req.body.quantity);
    res.status(200).json({ status: 'success', payload: 'Product quantity updated successfully' });
}));

router.delete('/:cartId/product/:productId', asyncHandler(async (req, res) => {
    await cartManager.deleteProductFromCart(req.params.cartId, req.params.productId);
    res.status(204).end();
}));

export { router };