import ChatModel from '../models/ChatModel.js';

class ChatDAO {

  static async createChat(userEmail) {
    return await ChatModel.create({ user: userEmail, messages: [] });
  }

  static async addMessagesToChat(userEmail, messages) {
    let chat = await ChatModel.findOne({ user: userEmail });
    messages.forEach(message => chat.messages.push(message));
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
