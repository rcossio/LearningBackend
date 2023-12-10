import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { redirectUnauthorizedOrAdmin, requireUserOrPremium, redirectUnauthenticated } from "../middlewares/authorization.js";

const router = Router();
const objIdFormat = "[0-9a-fA-F]{24}";

//public
router.get('/', ViewsController.homeView);
router.get('/not-authorized', ViewsController.notAuthorizedView);  

//users and premium
router.get('/cart', redirectUnauthorizedOrAdmin, ViewsController.cartView);
router.get('/chat', redirectUnauthorizedOrAdmin, ViewsController.chatView);
router.get(`/purchase-successful/:ticketCode(${objIdFormat})`, requireUserOrPremium, ViewsController.purchaseSuccessfulView);
router.get('/purchase-failed', requireUserOrPremium, ViewsController.purchaseFailedView);
router.get('/cart-modification-failed', requireUserOrPremium, ViewsController.unableToModifyCartFailedView);

//users, premium and admin
router.get('/profile', redirectUnauthenticated, ViewsController.profileView);


export { router };
