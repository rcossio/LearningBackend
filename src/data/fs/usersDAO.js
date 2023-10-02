import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const __dirname = path.resolve();

class UserDAO {
  #users = [];
  #path = '';

  constructor(path = `${__dirname}/src/data/fs/users_fs.json`) {
    this.#setPath(path);
  }

  #setPath(path) {
    this.#path = path;
    if (!fs.existsSync(this.#path)) {
      this.#saveFile();
    }
  }

  async #loadUsers() {
    try {
      const content = await fs.promises.readFile(this.#path, 'utf-8');
      this.#users = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  async #saveFile() {
    const content = JSON.stringify(this.#users);
    try {
      await fs.promises.writeFile(this.#path, content);
    } catch (error) {
      throw error;
    }
  }

  async addNewUser(user) {
    user._id = uuidv4(); 
    this.#users.push(user);
    await this.#saveFile();
    return user;
  }

  async getUserByEmail(email) {
    await this.#loadUsers();
    return this.#users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  async getUserById(id) {
    await this.#loadUsers();
    return this.#users.find(user => user._id === id);
  }

  async createChat(id, chatId) {
    await this.#loadUsers();
    const user = this.#users.find(u => u._id === id);
    if (!user) {
      throw new Error(`User not found. Requested ID: ${id}`);
    }
    user.chatId = chatId;
    await this.#saveFile();
    return user;
  }

  async setUserPasswordByEmail(email, hashedPassword) {
    await this.#loadUsers();
    const user = this.#users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error(`User not found. Requested email: ${email}`);
    }
    user.password = hashedPassword;
    await this.#saveFile();
    return user;
  }
}

export default UserDAO;
