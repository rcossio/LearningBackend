import ProductManager from '../dao/managers/ProductManager.js';
import CartManager from '../dao/managers/CartManager.js';
import ChatManager from '../dao/managers/ChatManager.js';

const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

export {
  productManager, 
  cartManager, 
  chatManager, 
};



