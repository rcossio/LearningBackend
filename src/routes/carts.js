import { Router } from 'express';
import CartsController from '../controllers/carts.js';
import { requireUserLogin, checkIsUser, checkIsAdmin } from "../middlewares/roles.js";


const router = Router();

//API for user
router.post("/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})/:option", requireUserLogin , CartsController.addProductToCart);
router.post('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', checkIsUser, CartsController.deleteProductFromCart);
router.post('/:cartId([0-9a-fA-F]{24})/purchase', checkIsUser , CartsController.purchaseCart);

//API for admin
router.get('/:cartId([0-9a-fA-F]{24})', checkIsAdmin, CartsController.getCartById);
router.put('/:cartId([0-9a-fA-F]{24})', checkIsAdmin, CartsController.updateCart);
router.delete('/:cartId([0-9a-fA-F]{24})', checkIsAdmin, CartsController.deleteCart);
router.post('/', checkIsAdmin, CartsController.createCart); //not useful
router.put('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', checkIsAdmin, CartsController.updateProductInCart); //not useful


export { router };
