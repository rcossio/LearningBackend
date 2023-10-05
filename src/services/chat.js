import {chatDAO} from "../data/factory.js";
import { faker } from '@faker-js/faker';

class ChatService {

  static async getChatHistory(username) {
    return await chatDAO.getMessages(username);
  }

  static async addChatMessage(username, newMessage) {
    const backendResponse = faker.company.catchPhrase()
    const backendMessage = `${new Date().toLocaleString()}  -  BACKEND: ${backendResponse}`;
    await chatDAO.addMessagesToChat(username, [newMessage, backendMessage]);
    return await chatDAO.getMessages(username);
  }

  static async createNewChat(userEmail) {
    return await chatDAO.createChat(userEmail);
  }
}

export default ChatService;
