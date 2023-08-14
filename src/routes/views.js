import { Router } from "express";
import { productManager, cartManager } from "../config/config.js";

const router = Router();

router.get("/", async (req, res) => {
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
    const result = await productManager.getProducts(filter, options);

    if (result.docs.length === 0) { 
      return res.status(404).render('error', { message: 'Page does not exist' });
    }

    res.status(200).render('home', { ...result, sort, query });
  } catch (error) {
    res.status(400).render('error', { message: error.message });
  }
}); 

router.get('/carts/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCartById(cartId);
    res.status(200).render('cart', cart);
  } catch (error) {
    res.status(400).send({ status: 'error', payload: error.message });
  }
});

router.get("/chat", async (req, res) => {
  res.render('chat');
}); 

export {router};