import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { checkRole } from "../middlewares/roles.js";

const router = Router();

//public
router.get("/", ViewsController.renderHome);
router.get('/not-authorized', ViewsController.renderNotAuthorized);  

//for users
router.get("/cart", checkRole(['user']), ViewsController.renderCart);
router.get("/chat", checkRole(['user']), ViewsController.renderChat);
router.get('/successful-purchase', checkRole(['user']), ViewsController.renderSuccessfulPurchase);
router.get('/failed-purchase', checkRole(['user']), ViewsController.renderFailedPurchase);

//for users and admins
router.get("/profile", checkRole(['user','admin']),ViewsController.renderProfile);


export { router };
