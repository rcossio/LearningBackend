import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { checkRole } from "../middlewares/roles.js";

const router = Router();

//public
router.get("/", ViewsController.homeView);
router.get('/not-authorized', ViewsController.notAuthorizedView);  

//for users
router.get("/cart", checkRole(['user']), ViewsController.cartView);
router.get("/chat", checkRole(['user']), ViewsController.chatView);
router.get('/purchase-successful/:ticketCode', checkRole(['user']), ViewsController.purchaseSuccessfulView);
router.get('/purchase-failed', checkRole(['user']), ViewsController.purchaseFailedView);

//for users and admins
router.get("/profile", checkRole(['user','admin']),ViewsController.profileView);


export { router };
