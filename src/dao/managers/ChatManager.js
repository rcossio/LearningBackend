import ChatModel from '../models/ChatModel.js';
import { getQuote } from 'inspirational-quotes';

class ChatManager {

  async addMessage(activeUser, newMessage) {
    let chat = await ChatModel.findOne({user: activeUser});
    if (chat) {
      chat.messages.push(newMessage);
      chat.messages.push(`${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`)
    } else {
      chat = await ChatModel.create({user: activeUser, messages: newMessage});
      chat.messages.push(`${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`)
    }
    await chat.save();
  }

  async getMessages(activeUser) {
    const chat = await ChatModel.findOne({user: activeUser});
    if (!chat) {
      return [];
    }
    return chat.messages;
  }
}

export default ChatManager;