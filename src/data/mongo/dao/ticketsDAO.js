import TicketModel from '../models/TicketModel.js';

class TicketDAO {

  static async createTicket(ticketInfo) {
    return await TicketModel.create(ticketInfo);
  }

  static async getTicketByCode(ticketCode) {
    return await TicketModel.findOne({ code: ticketCode });
  }

}

export default TicketDAO;
