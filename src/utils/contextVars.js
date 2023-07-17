
import path from 'path';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const __dirname = path.resolve();

const PRODUCT_DATA_FILE = path.join(__dirname,'src/data/products.json');
const productManager = new ProductManager(PRODUCT_DATA_FILE);

const CART_DATA_FILE = path.join(__dirname,'src/data/carts.json');
const cartManager = new CartManager(CART_DATA_FILE);

export {productManager, cartManager};
