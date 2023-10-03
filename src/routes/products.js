import { Router } from 'express';
import ProductsController from '../controllers/products.js';
import { checkRole } from "../middlewares/roles.js";


const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:productId([0-9a-fA-F]{24})', ProductsController.getProductById);
router.delete('/:productId([0-9a-fA-F]{24})', checkRole(['admin']), ProductsController.deleteProduct);
router.post('/', checkRole(['admin']), ProductsController.addProduct);
router.put('/:productId([0-9a-fA-F]{24})', checkRole(['admin']), ProductsController.updateProduct);

export { router };
