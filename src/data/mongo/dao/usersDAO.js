import UserModel from '../models/UserModel.js';
import CustomError from '../../../services/customError.js';

class UserDAO {

  static async addNewUser(user) {
    return await UserModel.create(user);
  }

  static async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email }).lean();
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

    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }

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

  static async userUpgradeToPremium(userId) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }

    user.role = 'premium';
    await user.save();
    return user;
  }

  static async updateLoginDate(userId, date) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new CustomError('User not found.','QUERY_ERROR');
    }

    user.last_connection = date;
    await user.save();
    return user;
  }

}

export default UserDAO;
