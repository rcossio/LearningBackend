import ProductsService from '../services/products.js';
import { faker } from '@faker-js/faker';
import logError from '../utils/errorHandler.js';
import {config} from '../config/config.js';

class ProductsController {

  static async getProducts(req, res) { //TODO: add error due to lack of connection with DB
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

    try {
      const result = await ProductsService.getProducts(filter, options);
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
      logError(error);
      res.status(400).json({ status: 'error', payload: error.message });
    }
  };

  static async getProductById(req, res) {
    const { productId } = req.params;
    try {
      const product = await ProductsService.getProductById(productId);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      logError(error);
      res.status(400).json({ status: 'error', payload: error.message });
    }
  };

  static async deleteProduct(req, res) {
    const { productId } = req.params;
    const email = req.auth.role === 'admin' ? null : req.auth.email;
    try {
      await ProductsService.deleteProduct(productId, email);
      res.status(204).end();
    } catch (error) {
      logError(error);
      res.status(400).json({ status: 'error', payload: error.message });
    }
  };

  static async addProduct(req, res) {
    try{
      const product = { 
        ...req.body,
        owner: req.auth.email === config.admin.email? 'admin': req.auth.email
      };
      const addedProduct = await ProductsService.addProduct(product);
      res.status(201).json({ status: 'success', payload: addedProduct });
    } catch (error) {
      logError(error);
      res.status(400).json({ status: 'error', payload: error.message });
    }
  };

  static async updateProduct(req, res) {
    const { productId } = req.params;
    const product = req.body;
    const email = req.auth.role === 'admin' ? null : req.auth.email;
    try {
      await ProductsService.updateProduct(productId, product, email);
      res.status(200).json({ status: 'success', payload: 'Product updated successfully' });
    } catch (error) {
      logError(error);
      res.status(400).json({ status: 'error', payload: error.message });
    }
  };

  static async mockingProducts(req, res) {
    const products = [];
    
    for (let i = 0; i < 100; i++) {
      const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),     
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()), 
        code: faker.string.alphanumeric(6).toUpperCase(),        
        stock: faker.number.int({ min: 1, max: 50 }), 
        category: faker.commerce.department(),    
        status: faker.datatype.boolean(),           
        thumbnails: [
          faker.image.url(),   
          faker.image.url(),           
          faker.image.url()
        ]
      };
  
      products.push(product);
    }
    res.status(200).json({status:'success', payload:products})
  }

}

export default ProductsController;
