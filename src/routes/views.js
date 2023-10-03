import { Router } from "express";
import ViewsController from "../controllers/views.js";
import { checkRole } from "../middlewares/roles.js";

const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/cart", checkRole(['user']), ViewsController.renderCart);
router.post("/add-to-cart/:productId([0-9a-fA-F]{24})/:option", checkRole(['user']), ViewsController.addToCart);
router.post("/delete-from-cart/:productId([0-9a-fA-F]{24})", checkRole(['user']), ViewsController.deleteFromCart);
router.get("/chat", checkRole(['user']), ViewsController.renderChat);
router.get("/profile", checkRole(['user','admin']),ViewsController.renderProfile);
router.get('/not-authorized', ViewsController.renderNotAuthorized);  
router.get('/successfull_purchase', ViewsController.renderSuccessfullPurchase);  


export { router };
