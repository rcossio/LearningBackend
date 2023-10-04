import ProductsService from '../services/products.js';
import { faker } from '@faker-js/faker';

class ProductsController {

  static async getProducts(req, res) {
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
  };

  static async getProductById(req, res) {
    const { productId } = req.params;
    const product = await ProductsService.getProductById(productId);
    res.status(200).json({ status: 'success', payload: product });
  };

  static async deleteProduct(req, res) {
    const { productId } = req.params;
    await ProductsService.deleteProduct(productId);
    res.status(204).end();
  };

  static async addProduct(req, res) {
    const product = req.body;
    await ProductsService.addProduct(product);
    res.status(201).json({ status: 'success', payload: 'Product added successfully' });
  };

  static async updateProduct(req, res) {
    const { productId } = req.params;
    const product = req.body;
    await ProductsService.updateProduct(productId, product);
    res.status(200).json({ status: 'success', payload: 'Product updated successfully' });
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
