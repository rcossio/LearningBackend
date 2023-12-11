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

  static async updateUserById(id, updates) {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new CustomError('User not found.', 'QUERY_ERROR');
    }

    for (const key in updates) {
      user[key] = updates[key];
    }

    await user.save();
    return user;
  }

  static async deleteUser(userId) {
    return await UserModel.findByIdAndDelete(userId);
  }

}

export default UserDAO;
