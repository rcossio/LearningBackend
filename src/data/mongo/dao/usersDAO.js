import UserModel from '../models/UserModel.js';
import CustomError from '../../../services/customError.js';

class UserDAO {

  static async addNewUser(user) {
    return await UserModel.create(user);
  }

  static async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email }).lean();
    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }
    return user 
  }

  static async getUserById(id) {
    const user = await UserModel.findById(id).lean();
    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }
    return user 
  }

  static async createChat(id, chatId) {
    const user = await UserModel.findById(id);
    user.chatId = chatId;
    await user.save();
    return user;
  }

  static async setUserPasswordByEmail(email, hashedPassword) {
    const result = await UserModel.updateOne({ email: email }, { password: hashedPassword });
    if (result.nModified === 0) {
      throw new CustomError('Failed to update password or user not found.','QUERY_ERROR');
    }
    return result;
  }
}

export default UserDAO;
