import { getCartById, addProductToCart } from '../services/carts.js';
import { createNewChat, assignChatToUser, getUserByEmail } from '../services/chat.js';
import { getProducts } from '../services/products.js';


async function renderHome(req, res) {
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

        const result = await getProducts(filter, options);

        if (result.docs.length === 0) {
            return res.status(404).render('error', { message: 'Page does not exist' });
        }

        res.status(200).render('home', { ...result, sort, query, user: req.user });
    } catch (error) {
        console.error(error.message);
        return res.status(400).render('home', { error: 'Error while loading this page', page: 1, totalPages: 1 });
    }
}

async function renderCart(req, res) {
    try {
        const { cartId } = req.params;
        const cart = await getCartById(cartId);
        res.status(200).render('cart', cart);
    } catch (error) {
        console.error(error.message);
        res.render('cart', { error: 'Error while loading your cart' });
    }
}

async function renderMyCart(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        const cart = await getCartById(req.user.cartId);
        res.status(200).render('cart', { ...cart, user: req.user });
    } catch (error) {
        console.error(error.message);
        res.render('cart', { error: 'Error while loading your cart' });
    }
}

async function addToMyCart(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        const cart = await getCartById(req.user.cartId);
        await addProductToCart(cart._id, req.params.productId, 1);
        res.status(200).redirect('/my-cart');
    } catch (error) {
        console.error(error.message);
        res.render('home', { error: 'Error while adding product to cart' });
    }
}

async function renderChat(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        if (!req.user.chatId) {
            const chat = await createNewChat(req.user.email);
            const user = await getUserByEmail(req.user.email);
            await assignChatToUser(user._id, chat._id);
        }

        res.render('chat', { user: req.user });
    } catch (error) {
        console.error(error.message);
        res.render('chat', { error: 'Error while accessing the chat' });
    }
}

async function renderProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        res.render('profile', { user: req.user });
    } catch (error) {
        console.error(error.message);
        res.render('profile', { error: 'Error while accessing to your profile information' });
    }
}

const viewController = {
    renderHome,
    renderCart,
    renderMyCart,
    addToMyCart,
    renderChat,
    renderProfile
}

export default viewController;