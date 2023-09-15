import UserModel from '../models/UserModel.js';
import cartDAO from './cartDAO.js';

class UserDAO {

  static #instance;

  constructor() {
    if (UserDAO.#instance) {
      return UserDAO.#instance;
    }
    UserDAO.#instance = this; // If no instance exists, assign this instance to the static field
  }

  static getInstance() {
    if (!UserDAO.#instance) {
      UserDAO.#instance = new UserDAO();
    }
    return UserDAO.#instance;
  }

  async addNewUser(user) {
    const cart = await cartDAO.createCart({ products: [] });
    return await UserModel.create( {...user, cartId: cart._id} );; 
  }

  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email }).lean();

    if (!user) {
      return null;
    }

    return user;
  }

  async getUserById(id) {
    const user = await UserModel.findById(id).lean();

    if (!user) {
      return null;
    }

    return user;
  }

  async createChat(id, chatId) {
    const user = await UserModel.findById(id);
    user.chatId = chatId;
    await user.save();
    return user;
  }

  async setUserPasswordByEmail(email, hashedPassword) {
    const result = await UserModel.updateOne({ email: email }, { password: hashedPassword });

    if (result.nModified === 0) {
      throw new Error('Failed to update password or user not found.');
    }
    
    return result;
  }

}

const userDAOInstance = new UserDAO();
export default userDAOInstance;