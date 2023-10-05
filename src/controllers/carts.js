import CartsService from '../services/carts.js';
import TicketService from '../services/tickets.js';
import handleAndLogError from '../utils/errorHandler.js';

class CartsController {
    static async createCart(req, res) {
        const cart = await CartsService.createNewCart();
        res.status(201).json({ status: 'success', payload: cart });
    }

    static async getCartById(req, res) {
        try {
            const cart = await CartsService.getCartById(req.params.cartId);
            res.status(200).json({ status: 'success', payload: cart });
        } catch (error) {
            handleAndLogError(error);
            res.status(404).json({ status: 'error', payload: error.message });
        }
    }

    static async updateCart(req, res) {
        await CartsService.modifyCart(req.params.cartId, req.body.products);
        res.status(200).json({ status: 'success', payload: 'Cart updated successfully' });
    }

    static async deleteCart(req, res) {
        try {
            await CartsService.removeCart(req.params.cartId);
            res.status(200).end();
        } catch (error) {
            handleAndLogError(error);
            res.status(404).json({ status: 'error', payload: error.message });
        }

    }

    static async updateProductInCart(req, res) {
        await CartsService.updateProductQuantity(req.params.cartId, req.params.productId, req.body.quantity);
        res.status(200).json({ status: 'success', payload: 'Product quantity updated successfully' });
    }

    static async deleteProductFromCart(req, res) {
        await CartsService.deleteProductFromCart(req.user.cartId, req.params.productId);
        res.status(200).redirect('/cart');
      }

    static async addProductToCart(req, res) {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        
        const option = req.params.option || 'increase'

        try {
            if (option === 'increase') {
                await CartsService.addProductToCart(req.user.cartId, req.params.productId, 1);
            } else if (option === 'decrease') {
                await CartsService.addProductToCart(req.user.cartId, req.params.productId, -1);
            }
            res.status(200).redirect('/cart');
        } catch (error) {
            handleAndLogError(error);
            res.status(500).redirect('/add-product-to-cart-failed')
        }
    }

    static async purchaseCart(req, res) {
        try {
            const ticketCode = await TicketService.createTicket(req.params.cartId, req.user.email);
            res.redirect(`/purchase-successful/${ticketCode}`);
        } catch (error) {
            handleAndLogError(error);
            res.redirect('/purchase-failed')
        }
    }

}

export default CartsController;
