import ProductManager from '../dao/managers/ProductManager.js';
import CartManager from '../dao/managers/CartManager.js';
import ChatManager from '../dao/managers/ChatManager.js';
import UserManager from '../dao/managers/UserManager.js'

const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();
const userManager = new UserManager();

export {
  productManager, 
  cartManager, 
  chatManager, 
  userManager
};



