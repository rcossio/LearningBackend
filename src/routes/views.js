import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { requireUserLogin, checkIsUser, requireLogin } from "../middlewares/roles.js";

const router = Router();

//public
router.get("/", ViewsController.homeView);
router.get('/not-authorized', ViewsController.notAuthorizedView);  

//for users
router.get("/cart", requireUserLogin, ViewsController.cartView);
router.get("/chat", requireUserLogin, ViewsController.chatView);
router.get('/purchase-successful/:ticketCode', checkIsUser, ViewsController.purchaseSuccessfulView);
router.get('/purchase-failed', checkIsUser, ViewsController.purchaseFailedView);
router.get('/add-product-to-cart-failed', checkIsUser, ViewsController.addProductToCartFailedView);

//for users and admins
router.get("/profile", requireLogin, ViewsController.profileView);


export { router };
