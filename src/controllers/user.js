import logError from "../utils/errorHandler.js";
import UserService from "../services/users.js";

class UserController {
  static async userUpgradeToPremium(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.userUpgradeToPremium(userId);
      res.status(200).json({status: 'success', payload: user});
    } catch (error) {
      logError(error);
      res.status(500).json({ status: 'error', payload: error.message });
    }
  }

  static async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.deleteUser(userId);
      res.status(200).json({status: 'success', payload: user});
    } catch (error) {
      logError(error);
      res.status(500).json({ status: 'error', payload: error.message });
    }
  }

  static currentUser(req,res) {
    const userData = UserService.getUserData(req.auth);
    return res.json({ status: 'success', payload: userData });
  }

}

export default UserController;