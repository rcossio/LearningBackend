import CartsService from '../services/carts.js';
import TicketService from '../services/tickets.js';

class CartsController {
    static async createCart(req, res) {
        const cart = await CartsService.createNewCart();
        res.status(201).json({ status: 'success', payload: cart });
    }

    static async getCartById(req, res) {
        const cart = await CartsService.getCartById(req.params.cartId);
        res.status(200).json({ status: 'success', payload: cart });
    }

    static async updateCart(req, res) {
        await CartsService.modifyCart(req.params.cartId, req.body.products);
        res.status(200).json({ status: 'success', payload: 'Cart updated successfully' });
    }

    static async deleteCart(req, res) {
        await CartsService.removeCart(req.params.cartId);
        res.status(200).end();
    }

    static async addProductToCart(req, res) {
        await CartsService.addProductToCart(req.params.cartId, req.params.productId);
        res.status(201).json({ status: 'success', payload: 'Product added to cart successfully' });
    }

    static async updateProductInCart(req, res) {
        await CartsService.updateProductQuantity(req.params.cartId, req.params.productId, req.body.quantity);
        res.status(200).json({ status: 'success', payload: 'Product quantity updated successfully' });
    }

    static async deleteProductFromCart(req, res) {
        await CartsService.removeProductFromCart(req.params.cartId, req.params.productId);
        res.status(204).end();
    }

    static async purchaseCart(req, res) {
        try {
            await TicketService.createTicket(req.params.cartId, req.user.email);
            res.status(200).redirect('/successfull_purchase');
        } catch (error) {
            console.error(error.message);
            res.render('cart', { error: 'Error while purchasing the cart' });
        }
    }

}

export default CartsController;
