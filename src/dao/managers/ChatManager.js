import ChatModel from '../models/ChatModel.js';
import { getQuote } from 'inspirational-quotes';

class ChatManager {

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

export default ChatManager;