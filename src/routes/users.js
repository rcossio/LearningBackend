import { Router } from "express";
import UserController from '../controllers/user.js';
import { requireUserOrPremium, requireAdmin, requireAuthenticated } from "../middlewares/authorization.js";

const router = Router();
const objIdFormat = "[0-9a-fA-F]{24}";

// user, premium and admin
router.get("/current", requireAuthenticated, UserController.currentUser);
router.post('/upload-profile-img', requireAuthenticated, UserController.uploadProfileImage);

// users, premium
router.post(`/:userId(${objIdFormat})/documents`,requireUserOrPremium, UserController.uploadDocuments);

// admin
router.post(`/premium/:userId(${objIdFormat})`, requireAdmin, UserController.changeUserRole); 
router.delete(`/:userId(${objIdFormat})`, requireAdmin, UserController.deleteUser); 
router.delete('/', requireAdmin, UserController.deleteInactiveUsers);


export {router};