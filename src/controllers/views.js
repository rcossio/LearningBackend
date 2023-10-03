import CartsService from '../services/carts.js';
import ChatService from '../services/chat.js';
import ProductsService from '../services/products.js';
import UsersService from '../services/users.js';

class ViewsController {

  static async renderHome(req, res) {
    try {
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
        //console.log("CONTROLLER:",result) // this is working but it is not paginated and it wont render the page

        if (result.docs?.length === 0) {
            return res.status(404).render('error', { message: 'Page does not exist' });
        }

        res.status(200).render('home', { ...result, sort, query, user: req.user });
    } catch (error) {
        console.error(error.message);
        return res.status(400).render('home', { error: 'Error while loading this page', page: 1, totalPages: 1 });
    }
  }

  static async renderCart(req, res) {
    try {
        const { cartId } = req.params;
        const cart = await CartsService.getCartById(cartId);
        res.status(200).render('cart', cart);
    } catch (error) {
        console.error(error.message);
        res.render('cart', { error: 'Error while loading your cart' });
    }
  }

  static async renderMyCart(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        const cart = await CartsService.getCartById(req.user.cartId);
        res.status(200).render('cart', { ...cart, user: req.user });
    } catch (error) {
        console.error(error.message);
        res.render('cart', { error: 'Error while loading your cart' });
    }
  }

  static async addToCart(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        
        const option = req.params.option || 'increase'

        if (option === 'increase') {
            await CartsService.addProductToCart(req.user.cartId, req.params.productId, 1);
        } else if (option === 'decrease') {
            await CartsService.addProductToCart(req.user.cartId, req.params.productId, -1);
        }
        res.status(200).redirect('/my-cart');
    } catch (error) {
        console.error(error.message);
        res.render('home', { error: 'Error while updating product in cart' });
    }
  }

  static async deleteFromCart(req, res) {
    try {
        await CartsService.deleteProductFromCart(req.user.cartId, req.params.productId);
        res.status(200).redirect('/my-cart');
    } catch (error) {
        console.error(error.message);
        res.render('cart', { error: 'Error while deleting product from cart' });
    }
  }

  static async renderChat(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        if (!req.user.chatId) {
            const chat = await ChatService.createNewChat(req.user.email);
            const user = await UsersService.getUserByEmail(req.user.email);
            await UsersService.createChat(user._id, chat._id);
        }

        res.render('chat', { user: req.user });
    } catch (error) {
        console.error(error.message);
        res.render('chat', { error: 'Error while accessing the chat' });
    }
  }

  static async renderProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        const user = await UsersService.getUserByEmail(req.user.email);
        res.render('profile', { user });
    } catch (error) {
        console.error(error.message);
        res.render('profile', { error: 'Error while accessing to your profile information' });
    }
  }

  static async renderNotAuthorized(req, res) {
    res.status(401).json({ status: 'error', payload: 'You are not authorized to access this resource'})
  }

  static async renderSuccessfullPurchase(req, res) {
    const cart = await CartsService.getCartById(req.user.cartId);
    res.status(200).render('cart', { ...cart, user: req.user , message: "Your purchase was successfull!"});
  }

}

export default ViewsController;
