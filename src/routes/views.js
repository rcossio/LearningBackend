import { Router } from "express";
import ViewsController from "../controllers/views.js";

const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/carts/:cartId", ViewsController.renderCart);
router.get("/my-cart", ViewsController.renderMyCart);
router.post("/add-to-cart/:productId([0-9a-fA-F]{24})/:option", ViewsController.addToCart);
router.post("/delete-from-cart/:productId([0-9a-fA-F]{24})", ViewsController.deleteFromCart);
router.get("/chat", ViewsController.renderChat);
router.get("/profile", ViewsController.renderProfile);

export { router };
