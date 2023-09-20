import { Router } from 'express';
import ProductsController from '../controllers/products.js';

const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:productId([0-9a-fA-F]{24})', ProductsController.getProductById);
router.delete('/:productId([0-9a-fA-F]{24})', ProductsController.deleteProduct);
router.post('/', ProductsController.addProduct);
router.put('/:productId([0-9a-fA-F]{24})', ProductsController.updateProduct);

export { router };
