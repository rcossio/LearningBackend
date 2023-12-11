import ChatModel from '../models/ChatModel.js';

class ChatDAO {

  static async createChat(userEmail) {
    return await ChatModel.create({ user: userEmail, messages: [] });
  }

  static async addMessagesToChat(userEmail, message) { 
    let chat = await ChatModel.findOne({ user: userEmail });
    chat.messages.push(message);
    return await chat.save();
  }

  static async getMessages(userEmail) {
    const chat = await ChatModel.findOne({ user: userEmail });
    if (!chat) {
      return [];
    }
    return chat.messages;
  }
}

export default ChatDAO;
