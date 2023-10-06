import handleAndLogError from "../utils/errorHandler";
import UserService from "../services/users";

class UserController {
  static async userUpgradeToPremium(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.userUpgradeToPremium(userId);
      res.status(200).json(user);
    } catch (error) {
      handleAndLogError(error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;