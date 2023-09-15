import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import productController from '../controllers/products.js';

const router = Router();

router.get('/', asyncHandler(productController.getProducts));
router.get('/:productId([0-9a-fA-F]{24})', asyncHandler(productController.getProductById));
router.delete('/:productId([0-9a-fA-F]{24})', asyncHandler(productController.deleteProduct));
router.post('/', asyncHandler(productController.addProduct));
router.put('/:productId([0-9a-fA-F]{24})', asyncHandler(productController.updateProduct));

export { router };
