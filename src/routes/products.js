import {Router} from 'express';
import {productManager} from '../config/config.js';

const router = Router();

router.get('/', async (req, res) => {
  const { limit = 3, page = 1, sort = 'asc', query = '' } = req.query;
  const sortOrder = sort === 'desc'? -1 : 1; 

  const filter = query ? { title: new RegExp(query, 'i') } : {};  

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { price: sortOrder, _id: 1 },
    lean: true
  };

  try {
    const result = await productManager.getProducts(filter, options);
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  const {productId} = req.params;
  try {
    const product = await productManager.getProductById(productId);
    res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', payload: error.message });
  } 
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
      await productManager.deleteProduct(productId);
      res.status(200).json({ status: 'success', payload: 'Product deleted successfully' });
  } catch (error) {
      res.status(400).json({ status: 'error', payload: error.message });
  }
});

router.post('/', async (req, res) => {
  const product = req.body;
  try {
      await productManager.addProduct(product);
      res.status(200).json({ status: 'success', payload: 'Product added successfully' });
  } catch (error) {
      res.status(400).json({ status: 'error', payload: error.message });
  }
});

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = req.body;
  try {
      await productManager.updateProduct(productId, product);
      res.status(200).json({ status: 'success', payload: 'Product updated successfully' });
  } catch (error) {
      res.status(400).json({ status: 'error', payload: error.message });
  }
});

export {router};