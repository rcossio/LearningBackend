import { Router } from "express";
import UserController from '../controllers/user.js';
import { requireAdmin, requireAuthenticated } from "../middlewares/authorization.js";

const router = Router();
const objIdFormat = "[0-9a-fA-F]{24}";

// user, premium and admin
router.get("/current", requireAuthenticated, UserController.currentUser);

// admin
router.post(`/premium/:userId(${objIdFormat})`, requireAdmin, UserController.userUpgradeToPremium); 
router.delete(`/:userId(${objIdFormat})`, requireAdmin, UserController.deleteUser); 


export {router};