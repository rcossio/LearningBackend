import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { requireRole, redirectUnauthorizedOrAdmin, requireUserOrPremium, redirectUnauthenticated } from "../middlewares/authorization.js";

const router = Router();

//public
router.get('/', ViewsController.homeView);
router.get('/not-authorized', ViewsController.notAuthorizedView);  

//users
router.get('/request-upgrade', requireRole({ allowedRoles: ['user'] }), ViewsController.userUpgradeFormView);
router.get('/request-upgrade-successful', requireRole({ allowedRoles: ['user'] }), ViewsController.userUpgradeRequestSuccessfulView);
router.get('/request-upgrade-failed', requireRole({ allowedRoles: ['user'] }), ViewsController.userUpgradeRequestFailedView);

//premium
router.get('/store', requireRole({ allowedRoles: ['premium'] }), ViewsController.premiumStoreView);
router.get('/add-product', requireRole({ allowedRoles: ['premium'] }), ViewsController.premiumAddProductView);

//users and premium
router.get('/cart', redirectUnauthorizedOrAdmin, ViewsController.cartView);
router.get('/chat', redirectUnauthorizedOrAdmin, ViewsController.chatView);
router.get(`/purchase-successful/:ticketCode`, requireUserOrPremium, ViewsController.purchaseSuccessfulView);
router.get('/purchase-failed', requireUserOrPremium, ViewsController.purchaseFailedView);
router.get('/cart-modification-failed', requireUserOrPremium, ViewsController.unableToModifyCartFailedView);

//users, premium and admin
router.get('/profile', redirectUnauthenticated, ViewsController.profileView);


export { router };
