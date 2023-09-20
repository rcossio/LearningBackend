import chatDAO from '../data/mongo/dao/chatDAO.js';
import { getQuote } from 'inspirational-quotes';

class ChatService {

  static async getChatHistory(username) {
    return await chatDAO.getMessages(username);
  }

  static async addChatMessage(username, newMessage) {
    const backendMessage = `${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`;
    await chatDAO.addMessagesToChat(username, [newMessage, backendMessage]);
    return await chatDAO.getMessages(username);
  }

  static async createNewChat(userEmail) {
    return await chatDAO.createChat(userEmail);
  }
}

export default ChatService;
