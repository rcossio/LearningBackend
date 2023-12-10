import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { app } from '../../src/app.js'; 
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(path.resolve(), '.env.testing')
  });

const { expect } = chai;
chai.use(chaiAsPromised);
const request = supertest(app);

describe('Product Router', function() {

  before(function() {
    this.timeout(5000); // Set a timeout of 10 seconds for all tests in this describe block
    return new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const response = await request.get('/api/products');
      expect(response.status).to.equal(200);
      const products = response.body.payload;
      if (products.length > 0) {
        expect(products[0]).to.have.property('_id');
      }
    });

    it('should return a list of two products', async () => {
        const response = await request.get('/api/products/?limit=2');
        expect(response.status).to.equal(200);
        const products = response.body.payload;
        expect(products.length).to.equal(2);
      });
  });

  describe('GET /api/products/:productId', () => {
    it('should return a product from a valid id', async () => {
      const response = await request.get('/api/products');
      const products = response.body.payload;
      if (products.length > 0) {
        const productId = products[0]._id;
        const secondResponse = await request.get(`/api/products/${productId}`);
        expect(secondResponse.status).to.equal(200);
        expect(secondResponse.body.payload).to.have.property('_id');
        expect(secondResponse.body.payload._id).to.equal(productId);
      }
    });
    it('should return error 400 with invalid ID of the right format', async () => {
      const response = await request.get('/api/products/6525572f3cc5f8ae1f6aaeba'); //invalid id 
      expect(response.status).to.equal(400);
    });
    it('should return error 404 with invalid ID format', async () => {
        const response = await request.get('/api/products/invalid-id-format'); //invalid id 
        expect(response.status).to.equal(404);
    });
  });

  describe('POST /api/products, PUT /api/products/productId and DELETE /api/products/productId', () => {

    it('should add a new product, consult it, update it and delete it for an premium user', async () => {
      const jwtCookie = process.env.PREMIUM_USER_COOKIE

      const newProduct = {
        title: "New Product",
        description: "A description for the new product",
        code: "XYZ123",
        price: 19.99,
        status: true,
        stock: 100,
        category: "New Category",
        thumbnails: ["thumbnail1.jpg", "thumbnail2.jpg"],
      };
  
      const response = await request.post('/api/products').set('Cookie', [`jwt=${jwtCookie}`]).send(newProduct);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success'); 
      expect(response.body.payload).to.have.property('_id');

      const productId = response.body.payload._id;
      const secondResponse = await request.get(`/api/products/${productId}`);
      expect(secondResponse.body.payload).to.have.property('title');
      expect(secondResponse.body.payload.title).to.equal('New Product');
      //TO DO: Add this validation expect(secondResponse.body.payload.owner).to.equal(user.email);

      const updatedProduct = {
        title: "New Title",
        stock: 123,
      };

      const thirdResponse = await request.put(`/api/products/${productId}`).set('Cookie', [`jwt=${jwtCookie}`]).send(updatedProduct);
      expect(thirdResponse.status).to.equal(200);
      expect(thirdResponse.body.status).to.equal('success');

      const fourthResponse = await request.get(`/api/products/${productId}`);
      expect(fourthResponse.body.payload.title).to.equal('New Title');
      expect(fourthResponse.body.payload.stock).to.equal(123);

      const fifthResponse = await request.delete(`/api/products/${productId}`).set('Cookie', [`jwt=${jwtCookie}`]);
      expect(fifthResponse.status).to.equal(204);
    });  


    it('should add a new product, consult it, update it and delete it for the admin user', async () => {
        const jwtCookie = process.env.ADMIN_USER_COOKIE
        
        const newProduct = {
          title: "New Product",
          description: "A description for the new product",
          code: "123XYZ",
          price: 19.99,
          status: true,
          stock: 100,
          category: "New Category",
          thumbnails: ["thumbnail1.jpg", "thumbnail2.jpg"],
        };
    
        const response = await request.post('/api/products').set('Cookie', [`jwt=${jwtCookie}`]).send(newProduct);
        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal('success'); 
        expect(response.body.payload).to.have.property('_id');
  
        const productId = response.body.payload._id;
        const secondResponse = await request.get(`/api/products/${productId}`);
        expect(secondResponse.body.payload).to.have.property('title');
        expect(secondResponse.body.payload.title).to.equal('New Product');
        //TO DO: Add this validation expect(secondResponse.body.payload.owner).to.equal('admin');
  
        const updatedProduct = {
          title: "New Title",
          stock: 123,
        };
  
        const thirdResponse = await request.put(`/api/products/${productId}`).set('Cookie', [`jwt=${jwtCookie}`]).send(updatedProduct);
        expect(thirdResponse.status).to.equal(200);
        expect(thirdResponse.body.status).to.equal('success');
  
        const fourthResponse = await request.get(`/api/products/${productId}`);
        expect(fourthResponse.body.payload.title).to.equal('New Title');
        expect(fourthResponse.body.payload.stock).to.equal(123);
  
        const fifthResponse = await request.delete(`/api/products/${productId}`).set('Cookie', [`jwt=${jwtCookie}`]);
        expect(fifthResponse.status).to.equal(204);
      });  
  });

});
