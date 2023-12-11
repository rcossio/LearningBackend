import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CustomError from '../../services/customError.js';

const __dirname = path.resolve();

class TicketsDAO {
  static #tickets = [];
  static #path = `${__dirname}/src/data/fs/tickets_fs.json`;

  constructor(filePath) {
    if (filePath) {
      TicketsDAO.#setPath(filePath);
    }
    if (!fs.existsSync(TicketsDAO.#path)) {
      TicketsDAO.#saveFile();
    }
  }

  static #setPath(path) {
    TicketsDAO.#path = path;
  }

  static async #loadTickets() {
    try {
      const content = await fs.promises.readFile(TicketsDAO.#path, 'utf-8');
      TicketsDAO.#tickets = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  static async #saveFile() {
    const content = JSON.stringify(TicketsDAO.#tickets);
    try {
      await fs.promises.writeFile(TicketsDAO.#path, content);
    } catch (error) {
      throw error;
    }
  }

  static async createTicket(ticketData) {
    const ticket = {_id: uuidv4(), ...ticketData};
    TicketsDAO.#tickets.push(ticket);
    await TicketsDAO.#saveFile();
    return ticket;
  }

  static async getTicketByCode(ticketCode) {
    await TicketsDAO.#loadTickets();
    const ticket = TicketsDAO.#tickets.find(ticket => ticket.code === ticketCode);
    if (!ticket) {
      throw new CustomError(`Ticket not found for code: ${ticketCode}`, 'QUERY_ERROR');
    }
    return ticket;
  }
}

export default TicketsDAO;
