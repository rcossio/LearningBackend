import TicketModel from '../models/TicketModel.js';

class TicketDAO {

  static async createTicket(ticketInfo) {
    return await TicketModel.create(ticketInfo);
  }

}

export default TicketDAO;
