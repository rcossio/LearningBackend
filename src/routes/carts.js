import { Router } from 'express';
import CartsController from '../controllers/carts.js';
import { checkRole } from "../middlewares/roles.js";


const router = Router();

router.post('/', CartsController.createCart);
router.get('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.getCartById);
router.put('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.updateCart);
router.delete('/:cartId([0-9a-fA-F]{24})', checkRole(['admin']), CartsController.deleteCart);
router.post('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.addProductToCart);
router.put('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.updateProductInCart);
router.delete('/:cartId([0-9a-fA-F]{24})/product/:productId([0-9a-fA-F]{24})', CartsController.deleteProductFromCart);
router.post('/:cartId([0-9a-fA-F]{24})/purchase', CartsController.purchaseCart);


export { router };
