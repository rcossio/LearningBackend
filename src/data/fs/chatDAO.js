import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CustomError from '../../services/customError.js';

const __dirname = path.resolve();

class ChatDAO {
  static #chats = [];
  static #path = '';

  constructor(path = `${__dirname}/src/data/fs/chats_fs.json`) {
    ChatDAO.#setPath(path);
  }

  static #setPath(path) {
    ChatDAO.#path = path;
    if (!fs.existsSync(ChatDAO.#path)) {
      ChatDAO.#saveFile();
    }
  }

  static async #loadChats() {
    try {
      const content = await fs.promises.readFile(ChatDAO.#path, 'utf-8');
      ChatDAO.#chats = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  static async #saveFile() {
    const content = JSON.stringify(ChatDAO.#chats);
    try {
      await fs.promises.writeFile(ChatDAO.#path, content);
    } catch (error) {
      throw error;
    }
  }

  static async createChat(userEmail) {
    const chat = {
      _id: uuidv4(),  // Generate a unique ID for the chat
      user: userEmail,
      messages: []
    };
    ChatDAO.#chats.push(chat);
    await ChatDAO.#saveFile();
    return chat;
  }

  static async addMessagesToChat(userEmail, message) {
    await ChatDAO.#loadChats();
    const chat = ChatDAO.#chats.find(chat => chat.user.toLowerCase() === userEmail.toLowerCase());
    if (!chat) {
      throw new CustomError(`Chat not found for user: ${userEmail}`, 'QUERY_ERROR');
    }
    chat.messages.push(message);
    await ChatDAO.#saveFile();
  }

  static async getMessages(userEmail) {
    await ChatDAO.#loadChats();
    const chat = ChatDAO.#chats.find(chat => chat.user.toLowerCase() === userEmail.toLowerCase());
    if (!chat) {
      throw new CustomError(`Chat not found for user: ${userEmail}`, 'QUERY_ERROR');
    }
    return chat.messages;
  }
}

export default ChatDAO;
