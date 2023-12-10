import { Router } from 'express';
import ProductsController from '../controllers/products.js';
import { checkIsPremiumOrAdmin } from "../middlewares/roles.js";


const router = Router();

//public API
router.get('/', ProductsController.getProducts); 
router.get('/:productId([0-9a-fA-F]{24})', ProductsController.getProductById); 

//API for admin or premium users
router.post('/', checkIsPremiumOrAdmin, ProductsController.addProduct); 
router.delete('/:productId([0-9a-fA-F]{24})', checkIsPremiumOrAdmin, ProductsController.deleteProduct); 
router.put('/:productId([0-9a-fA-F]{24})', checkIsPremiumOrAdmin,  ProductsController.updateProduct); 

export { router };
