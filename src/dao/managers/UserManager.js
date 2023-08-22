import UserModel from '../models/UserModel.js';

class UserManager {

  async addNewUser(user) {
    return await UserModel.create(user);
  }

  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email }).lean();

    if (!user) {
      return null;
    }

    return user;
  }

}

export default UserManager;