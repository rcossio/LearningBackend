import { Router } from "express";
import { productManager, cartManager } from "../config/config.js";
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
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

  res.status(200).render('home', { ...result, sort, query });
}));

router.get('/carts/:cartId', asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);
  res.status(200).render('cart', cart);
}));

router.get("/chat", (req, res) => {
  res.render('chat');
}); 

export { router };