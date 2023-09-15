import { Router } from "express";
import viewController from "../controllers/views.js";

const router = Router();

router.get("/", viewController.renderHome);
router.get("/carts/:cartId", viewController.renderCart);
router.get("/my-cart", viewController.renderMyCart);
router.post("/add-to-my-cart/:productId([0-9a-fA-F]{24})", viewController.addToMyCart);
router.get("/chat", viewController.renderChat);
router.get("/profile", viewController.renderProfile);

export { router };
