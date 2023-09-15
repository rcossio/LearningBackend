import {
    createNewCart,
    fetchCartById,
    modifyCart,
    removeCart,
    addProductToUserCart,
    updateProductQuantityInCart,
    removeProductFromUserCart
} from '../services/carts.js';

async function createCart(req, res) {
    const cart = await createNewCart();
    res.status(201).json({ status: 'success', payload: cart });
}

async function getCartById(req, res) {
    const cart = await fetchCartById(req.params.cartId);
    res.status(200).json({ status: 'success', payload: cart });
}

async function updateCart(req, res) {
    await modifyCart(req.params.cartId, req.body.products);
    res.status(200).json({ status: 'success', payload: 'Cart updated successfully' });
}

async function deleteCart(req, res) {
    await removeCart(req.params.cartId);
    res.status(200).end();
}

async function addProductToCart(req, res) {
    await addProductToUserCart(req.params.cartId, req.params.productId);
    res.status(201).json({ status: 'success', payload: 'Product added to cart successfully' });
}

async function updateProductInCart(req, res) {
    await updateProductQuantityInCart(req.params.cartId, req.params.productId, req.body.quantity);
    res.status(200).json({ status: 'success', payload: 'Product quantity updated successfully' });
}

async function deleteProductFromCart(req, res) {
    await removeProductFromUserCart(req.params.cartId, req.params.productId);
    res.status(204).end();
}

const cartController = {
    createCart,
    getCartById,
    updateCart,
    deleteCart,
    addProductToCart,
    updateProductInCart,
    deleteProductFromCart
}

export default cartController;
