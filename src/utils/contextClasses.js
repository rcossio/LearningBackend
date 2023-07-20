import ProductManager from '../dao/models/ProductManager.js';
import CartManager from '../dao/models/CartManager.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

export {productManager, cartManager};
