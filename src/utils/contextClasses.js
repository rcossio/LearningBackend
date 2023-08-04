import ProductManager from '../dao/models/ProductManager.js';
import CartManager from '../dao/models/CartManager.js';
import ChatManager from '../dao/models/ChatManager.js';

const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

export {productManager, cartManager, chatManager};
