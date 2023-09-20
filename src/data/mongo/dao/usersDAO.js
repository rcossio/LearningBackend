import UserModel from '../models/UserModel.js';

class UserDAO {

  static async addNewUser(user) {
    return await UserModel.create(user);
  }

  static async getUserByEmail(email) {
    return await UserModel.findOne({ email: email }).lean();
  }

  static async getUserById(id) {
    return await UserModel.findById(id).lean();
  }

  static async createChat(id, chatId) {
    const user = await UserModel.findById(id);
    user.chatId = chatId;
    await user.save();
    return user;
  }

  static async setUserPasswordByEmail(email, hashedPassword) {
    return await UserModel.updateOne({ email: email }, { password: hashedPassword });
  }
}

export default UserDAO;
