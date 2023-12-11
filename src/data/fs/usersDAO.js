import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CustomError from '../../services/customError.js';

const __dirname = path.resolve();

class UserDAO {
  static #users = [];
  static #path = '';

  constructor(path = `${__dirname}/src/data/fs/users_fs.json`) {
    UserDAO.#setPath(path);
  }

  static #setPath(path) {
    UserDAO.#path = path;
    if (!fs.existsSync(UserDAO.#path)) {
      UserDAO.#saveFile();
    }
  }

  static async #loadUsers() {
    try {
      const content = await fs.promises.readFile(UserDAO.#path, 'utf-8');
      UserDAO.#users = JSON.parse(content);
    } catch (error) {
      throw error;
    }
  }

  static async #saveFile() {
    const content = JSON.stringify(UserDAO.#users);
    try {
      await fs.promises.writeFile(UserDAO.#path, content);
    } catch (error) {
      throw error;
    }
  }

  static async addNewUser(user) {
    user._id = uuidv4(); 
    UserDAO.#users.push(user);
    await UserDAO.#saveFile();
    return user;
  }

  static async getUserById(id) {
    await UserDAO.#loadUsers();
    const user = UserDAO.#users.find(user => user._id === id);
    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }
    return user;
  }

  static async getUserByEmail(email) {
    await UserDAO.#loadUsers();
    const user = UserDAO.#users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }
    return user;
  }

  static async updateUserById(id, updates) {
    await UserDAO.#loadUsers();
    const userIndex = UserDAO.#users.findIndex(user => user._id === id);
    if (userIndex === -1) {
      throw new CustomError('User not found.', 'QUERY_ERROR');
    }
    
    UserDAO.#users[userIndex] = { ...UserDAO.#users[userIndex], ...updates };
    const user = UserDAO.#users[userIndex];
    await UserDAO.#saveFile();
    return user;
  }

  static async deleteUser(userId) {
    await UserDAO.#loadUsers();
    const userIndex = UserDAO.#users.findIndex(user => user._id === userId);
    if (userIndex === -1) {
      throw new CustomError('User not found.', 'QUERY_ERROR');
    }
    const user = UserDAO.#users[userIndex];
    UserDAO.#users.splice(userIndex, 1);
    await UserDAO.#saveFile();
    return user;
  }
}

export default UserDAO;
