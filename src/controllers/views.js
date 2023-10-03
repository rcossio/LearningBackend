import CartsService from '../services/carts.js';
import ChatService from '../services/chat.js';
import ProductsService from '../services/products.js';
import UsersService from '../services/users.js';

class ViewsController {

  static async renderHome(req, res, customResponse = {}) {
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

    const result = await ProductsService.getProducts(filter, options);
    //console.log("CONTROLLER:",result) // if FS this is working but it is not paginated and it wont render the page

    res.status(200).render('home', { ...result, ...customResponse, sort, query, user: req.user });
  }

  static async renderCart(req, res, customResponse = {}) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    const cart = await CartsService.getCartById(req.user.cartId);
    res.status(200).render('cart', { ...cart, ...customResponse, user: req.user });
  }

  static async renderChat(req, res, customResponse = {}) {
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

  static async renderProfile(req, res, customResponse = {}) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    const user = await UsersService.getUserByEmail(req.user.email);
    res.render('profile', { ...customResponse, user });
  }

  static async renderNotAuthorized(req, res) {
    await ViewsController.renderHome(req, res, { message: 'You are not authorized to access this resource' });
  }

  static async renderSuccessfulPurchase(req, res) {
    await ViewsController.renderCart(req, res, { message: 'Your purchase was successfull!' });
  }

  static async renderFailedPurchase(req, res) {
    await ViewsController.renderCart(req, res, { error: 'Error while purchasing the cart' });
  }
}

export default ViewsController;
