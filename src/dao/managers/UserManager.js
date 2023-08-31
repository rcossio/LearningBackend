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

  async getUserById(id) {
    const user = await UserModel.findById(id).lean();

    if (!user) {
      return null;
    }

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

export default UserManager;