import { Router } from 'express';
import ProductsController from '../controllers/products.js';
import { checkIsAdmin, checkRole } from "../middlewares/roles.js";


const router = Router();

//public API
router.get('/', ProductsController.getProducts); 
router.get('/:productId([0-9a-fA-F]{24})', ProductsController.getProductById); 

//API for admin
router.delete('/:productId([0-9a-fA-F]{24})', checkIsAdmin, ProductsController.deleteProduct);
router.post('/', checkIsAdmin, ProductsController.addProduct);
router.put('/:productId([0-9a-fA-F]{24})', checkIsAdmin, ProductsController.updateProduct);
router.get('/mockingproducts', checkIsAdmin, ProductsController.mockingProducts);

export { router };
