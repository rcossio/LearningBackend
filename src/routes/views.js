import { Router } from "express";
import { productManager, cartManager, chatManager, userManager } from "../config/config.js";

const router = Router();

router.get("/", async (req, res) => {
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
  
    const result = await productManager.getProducts(filter, options);
  
    if (result.docs.length === 0) { 
      return res.status(404).render('error', { message: 'Page does not exist' });
    }
  
    res.status(200).render('home', { ...result, sort, query, user: req.user });

  } catch (error) { 
      console.error(error.message)
      return res.status(400).render('home', { error: 'Error while loading this page', page:1, totalPages:1 });
  }


});

router.get('/carts/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).render('cart', cart);
  } catch (error) {
    console.error(error.message)
    res.render('cart', { error: 'Error while loading your cart' });
  }

});


// Add to cart functionaliy
router.get('/my-cart', async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/login');
    }
    const cart = await cartManager.getCartById(req.user.cartId);
    res.status(200).render('cart', {...cart, user: req.user});
  } catch (error) {
    console.error(error.message)
    res.render('cart', { error: 'Error while loading your cart' });
  }
});

router.post('/add-to-my-cart/:productId([0-9a-fA-F]{24})', async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/login');
    }
    const cart = await cartManager.getCartById(req.user.cartId);
    await cartManager.addProductToCart(cart._id, req.params.productId, 1, productManager);
    res.status(200).redirect('/my-cart');
  } catch (error) {
    console.error(error.message)
    res.render('home', { error: 'Error while adding product to cart' });
  }
});


//Chat
router.get("/chat", async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  } 

  if (!req.user.chatId) {
    const chat = await chatManager.createChat(req.user.email);
    const user = await userManager.getUserByEmail(req.user.email);
    await userManager.createChat(user._id, chat._id);
  }

  res.render('chat', { user: req.user });
  
}); 


// Profile
router.get("/profile", async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/login');
    }
  
    res.render('profile', { user: req.user });
  } catch (error) {
    console.error(error.message)
    res.render('profile', { error: 'Error while accesing to your profile information' });

  }

});


export { router };