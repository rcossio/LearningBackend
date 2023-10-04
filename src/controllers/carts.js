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

        if (option === 'increase') {
            await CartsService.addProductToCart(req.user.cartId, req.params.productId, 1);
        } else if (option === 'decrease') {
            await CartsService.addProductToCart(req.user.cartId, req.params.productId, -1);
        }
        res.status(200).redirect('/cart');
    }

    static async purchaseCart(req, res) {
        try {
            const ticketCode = await TicketService.createTicket(req.params.cartId, req.user.email);
            res.redirect(`/purchase-successful/${ticketCode}`);
        } catch (error) {
            console.error(error.message);
            res.redirect('/purchase-failed')
        }
    }

}

export default CartsController;
