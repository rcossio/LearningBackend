import { ticketDAO } from "../data/factory.js";
import CartsService from './carts.js';
import ProductsService from './products.js';
import { v4 as uuidv4 } from 'uuid';

class TicketService {

  static async createTicket(cartId,email) {
    
    const amount = await CartsService.calculateTotal(cartId)
    if (amount === 0) {
      throw new Error('Cart is empty');
    }

    //check stock availability for each product in cart
    const cart = await CartsService.getCartById(cartId);
    for (const product of cart.products) {
      const productInfo = await ProductsService.getProductById(product.productId);
      if (productInfo.stock < product.quantity) {
        throw new Error(`Product ${productInfo.code} is out of stock`);
      }
    }

    //update stock
    for (const product of cart.products) {
      const productInfo = await ProductsService.getProductById(product.productId);
      const newStock = productInfo.stock - product.quantity;
      await ProductsService.updateProduct(product.productId, { stock: newStock });
    }

    const ticketInfo = {
      code: uuidv4(),
      putchase_datetime: Date.now(),
      amount,
      purchaser: email
    };

    await CartsService.emptyCart(cartId);
    await ticketDAO.createTicket(ticketInfo);

    return ticketInfo.code;
    
  }

  static async validateTicket(ticketCode, userEmail) {
    const ticket = await ticketDAO.getTicketByCode(ticketCode);
    if (!ticket) {
      return false
    }
    if (ticket.purchaser !== userEmail) {
      return false
    }
    return true
  }
}

export default TicketService;
