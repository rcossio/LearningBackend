import {
  getAllProducts,
  getProductById as getSingleProductById,
  deleteProduct as removeProduct,
  addNewProduct,
  modifyProduct
} from '../services/products.js';

const getProducts = async (req, res) => {
  const { limit = 3, page = 1, sort = 'asc', query = '' } = req.query;
  const sortOrder = sort === 'desc' ? -1 : 1;

  const filter = {};
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

  const result = await getAllProducts(filter, options);
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
};

const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await getSingleProductById(productId);
  res.status(200).json({ status: 'success', payload: product });
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await removeProduct(productId);
  res.status(204).end();
};

const addProduct = async (req, res) => {
  const product = req.body;
  await addNewProduct(product);
  res.status(201).json({ status: 'success', payload: 'Product added successfully' });
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const product = req.body;
  await modifyProduct(productId, product);
  res.status(200).json({ status: 'success', payload: 'Product updated successfully' });
};

const productController = {
  getProducts,
  getProductById,
  deleteProduct,
  addProduct,
  updateProduct
};

export default productController;