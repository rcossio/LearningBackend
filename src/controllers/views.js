import CartsService from '../services/carts.js';
import ChatService from '../services/chat.js';
import ProductsService from '../services/products.js';
import UsersService from '../services/users.js';
import TicketService from '../services/tickets.js'
import handleAndLogError from '../utils/errorHandler.js';

class ViewsController {

  static async homeView(req, res, customResponse = {}) {
    const { limit = 3, page = 1, sort = 'asc', query = '' } = req.query;
    const sortOrder = sort === 'desc' ? -1 : 1;

    const filter = { status: true };
    if (query) {
        filter.$or = [
            { title: new RegExp(query, 'i') },
            { category: new RegExp(query, 'i') }
        ];
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { price: sortOrder, _id: 1 },
        lean: true
    };

    try {
      const result = await ProductsService.getProducts(filter, options);
  
      res.status(200).render('home', { ...result, ...customResponse, sort, query, user: req.user }); 
    } catch {
      //get date in readable format
      const date = new Date().toLocaleString();
      res.status(500).render('error.hbs', {
        message: `
        Unable to connect to database. The app is not working right now. We are sorry for the inconveniences!
        Date: ${date}`
      });
    } 

  }

  static async cartView(req, res, customResponse = {}) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    try {
      const cart = await CartsService.getCartById(req.user.cartId);
      res.status(200).render('cart', { ...cart, ...customResponse, user: req.user });
    } catch(error) {
      handleAndLogError(error);
      res.status(500).render('cart', { products: [], error: 'Unable to load your cart, please contact our customer service' });
    }
  }

  static async chatView(req, res, customResponse = {}) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (!req.user.chatId) {
        const chat = await ChatService.createNewChat(req.user.email);
        const user = await UsersService.getUserByEmail(req.user.email);
        await UsersService.createChat(user._id, chat._id);
    }

    res.render('chat', { ...customResponse, user: req.user });
  }

  static async profileView(req, res, customResponse = {}) {
    const user = await UsersService.getUserByEmail(req.user.email);
    res.render('profile', { ...customResponse, user });
  }

  static async notAuthorizedView(req, res) {
    await ViewsController.homeView(req, res, { error: 'You are not authorized to access this resource' });
  }

  static async purchaseSuccessfulView(req, res) {
    const ticketIsValid = await TicketService.validateTicket(req.params.ticketCode, req.user.email);
    if (ticketIsValid) {
      return await ViewsController.cartView(req, res, { message: `Your purchase was successfull! Ticket code: ${req.params.ticketCode}` });
    }
    res.redirect('/page-not-found'); // INFO: endpoint does not exist so it will be captured by the 404 middleware
  }

  static async purchaseFailedView(req, res) {
    await ViewsController.cartView(req, res, { error: 'Error while purchasing the cart' }); // TODO: add out-of-stock error message
  }

  static async addProductToCartFailedView(req, res) {
    await ViewsController.homeView(req, res, { error: 'Unable to add product to cart. Please contact customer support.' });
  }

}

export default ViewsController;
