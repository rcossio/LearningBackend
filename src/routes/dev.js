import { Router } from 'express';
import ProductsController from '../controllers/products.js';
import DevController from '../controllers/dev.js';
import { checkIsAdmin} from "../middlewares/roles.js";


const router = Router();

router.get('/mockingproducts', checkIsAdmin, ProductsController.mockingProducts);
router.get('/loggerTest', checkIsAdmin, DevController.testLogger);


export { router };
