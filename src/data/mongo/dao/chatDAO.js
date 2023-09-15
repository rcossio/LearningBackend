import ChatModel from '../models/ChatModel.js';
import { getQuote } from 'inspirational-quotes';

class ChatDAO {

  static #instance;

  constructor() {
    if (ChatDAO.#instance) {
      return ChatDAO.#instance;
    }
    ChatDAO.#instance = this; // If no instance exists, assign this instance to the static field
  }

  static getInstance() {
    if (!ChatDAO.#instance) {
      ChatDAO.#instance = new ChatDAO();
    }
    return ChatDAO.#instance;
  }

  async createChat(userEmail) {
    return await ChatModel.create( {user: userEmail, messages: [] } );
  }

  async addMessage(userEmail, newMessage) {
    let chat = await ChatModel.findOne({user: userEmail});
    chat.messages.push(newMessage);
    chat.messages.push(`${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`)
    await chat.save();
  }

  async getMessages(userEmail) {
    const chat = await ChatModel.findOne({user: userEmail});
    if (!chat) {
      return [];
    }
    return chat.messages;
  }
}

const chatDAOInstance = new ChatDAO();
export default chatDAOInstance;