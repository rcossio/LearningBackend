import logError from "../utils/errorHandler.js";
import UserService from "../services/users.js";
import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

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


  static uploadDocuments(req, res, next) {
    // Configure multer
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/documents'));
      },
      filename: function(req, file, cb) {
        let newFileName = '';

        switch (file.fieldname) {
          case 'identification':
            newFileName = `${req.auth.id}_identification.pdf`;
            break;
          case 'proofOfAddress':
            newFileName = `${req.auth.id}_address.pdf`;
            break;
          case 'bankStatement':
            newFileName = `${req.auth.id}_bank.pdf`;
            break;
          default:
            newFileName = `unknown_${Date.now()}${path.extname(file.originalname)}`;
        }

        cb(null, newFileName);
      }
    });

    const upload = multer({ storage: storage });

    const uploadMiddleware = upload.fields([
      { name: 'identification', maxCount: 1 },
      { name: 'proofOfAddress', maxCount: 1 },
      { name: 'bankStatement', maxCount: 1 }
    ]);

    uploadMiddleware(req, res, function(err) {
      if (err) {
        res.redirect('/request-upgrade-failed');
      }

      if (!req.files['identification'] || !req.files['proofOfAddress'] || !req.files['bankStatement']) {
        res.redirect('/request-upgrade-failed');
      }

      res.redirect('/request-upgrade-successful');
    });
  }

  static async deleteInactiveUsers(req, res) {
    try {
      const inactiveUsers = await UserService.deleteInactiveUsers();
      res.status(200).json({status: 'success', payload: inactiveUsers});
    } catch (error) {
      logError(error);
      res.status(500).json({ status: 'error', payload: error.message });
    }
  }

}

export default UserController;