import { ticketDAO } from "../data/factory.js";
import CartsService from './carts.js';
import { v4 as uuidv4 } from 'uuid';

class TicketService {

  static async createTicket(cartId,email) {
    
    const amount = await CartsService.calculateTotal(cartId)
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
}

export default TicketService;
