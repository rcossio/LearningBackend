import mongoose from 'mongoose';
import {MONGO_ATLAS_CONNECTION_STRING} from '../../utils/contextVars.js' 
import { getQuote } from 'inspirational-quotes';

const chatSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true
  },
  messages: { 
    type: [String],
    required: true 
  },
});

const ChatModel = mongoose.model('messages', chatSchema);

class ChatManager {
  constructor() {
    mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async addMessage(activeUser, newMessage) {
    try {
      let chat = await ChatModel.findOne({user: activeUser});
      if (chat) {
        chat.messages.push(newMessage);
        chat.messages.push(`${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`)
      } else {
        chat = await ChatModel.create({user: activeUser, messages: newMessage});
        chat.messages.push(`${new Date().toLocaleString()}  -  BACKEND: ${getQuote({ author: false }).text}`)
      }
      await chat.save();
    } catch (error) {
      throw error;
    }
  }

  async getMessages(activeUser) {
    try {
      const chat = await ChatModel.findOne({user: activeUser});
      if (!chat) {
        return [];
      }
      return chat.messages;
    } catch (error) {
      throw error;
    }
  }
}

export default ChatManager;
