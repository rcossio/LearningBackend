import { Router } from 'express';
import CartsController from '../controllers/carts.js';
import { checkRole } from "../middlewares/roles.js";


const router = Router();

//API for user
router.post("/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})/:option", checkRole(['user']), CartsController.addProductToCart);
router.post('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', checkRole(['user']), CartsController.deleteProductFromCart);
router.post('/:cartId([0-9a-fA-F]{24})/purchase', checkRole(['user']), CartsController.purchaseCart);

//API for admin
router.get('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.getCartById);
router.put('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.updateCart);
router.delete('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.deleteCart);
router.post('/', checkRole(['admin']), CartsController.createCart); //not useful
router.put('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.updateProductInCart); //not useful


export { router };
