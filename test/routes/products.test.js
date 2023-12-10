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

async function getJwtCookie(email, password) {
  const loginResponse = await request.post('/auth/login').send({ email, password });
  const jwtCookie = loginResponse.headers['set-cookie']
      .find(cookie => cookie.startsWith('jwt='))
      .split(';')[0]; // Extracts the JWT token from the cookie

  return jwtCookie;
}

describe('Product Router', function() {
  let jwtPremiumUserCookie;
  let jwtAdminCookie;

  before(async function() {
    this.timeout(5000); // Set a timeout of 10 seconds for all tests in this describe block
    await new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start

    jwtPremiumUserCookie = await getJwtCookie(process.env.PREMIUM_USER_EMAIL, process.env.PREMIUM_USER_PASS);
    jwtAdminCookie = await getJwtCookie(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);

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
    
    it('should return the product called ZZ', async () => {
      const response = await request.get('/api/products/?query=ZZ');
      expect(response.status).to.equal(200);
      const products = response.body.payload;
      expect(products.length).to.equal(1);
      expect(products[0]).to.have.property('title', 'Product ZZ');
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


  describe('Product Management by Premium User', () => {
    let user;
    let productId;
  
    before(async () => {
      const baseResponse = await request.get('/auth/current-user').set('Cookie', [jwtPremiumUserCookie]);
      user = baseResponse.body.payload;
    });
  
    it('should allow a premium user to add a new product', async () => {
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
  
      const response = await request.post('/api/products')
                                    .set('Cookie', [jwtPremiumUserCookie])
                                    .send(newProduct);
  
      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success'); 
      expect(response.body.payload).to.have.property('_id');
      productId = response.body.payload._id;
    });
  
    it('should retrieve the newly added product', async () => {
      const response = await request.get(`/api/products/${productId}`);
      expect(response.body.payload).to.have.property('title', 'New Product');
      expect(response.body.payload.owner).to.equal(user.email);
    });
  
    it('should allow a premium user to update the product', async () => {
      const updatedProduct = { title: "New Title", stock: 123 };
  
      const response = await request.put(`/api/products/${productId}`)
                                    .set('Cookie', [jwtPremiumUserCookie])
                                    .send(updatedProduct);
  
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
    });
  
    it('should reflect the updated product details', async () => {
      const response = await request.get(`/api/products/${productId}`);
      expect(response.body.payload).to.have.property('title', 'New Title');
      expect(response.body.payload.stock).to.equal(123);
    });
  
    it('should allow a premium user to delete the product', async () => {
      const response = await request.delete(`/api/products/${productId}`)
                                    .set('Cookie', [jwtPremiumUserCookie]);
  
      expect(response.status).to.equal(204);
    });
  });  


  describe('Admin Product Management', () => {
    let jwtCookie;
    let productId;

    before(async () => {
      // Authenticate as an admin user
      jwtCookie = process.env.ADMIN_USER_COOKIE;
    });

    it('should allow an admin user to add a new product', async () => {
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

      const response = await request.post('/api/products')
                                    .set('Cookie', [jwtAdminCookie])
                                    .send(newProduct);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success'); 
      expect(response.body.payload).to.have.property('_id');
      productId = response.body.payload._id;
    });

    it('should retrieve the newly added product', async () => {
      const response = await request.get(`/api/products/${productId}`);
      expect(response.body.payload).to.have.property('title', 'New Product');
      expect(response.body.payload.owner).to.equal('admin');
    });

    it('should allow an admin user to update the product', async () => {
      const updatedProduct = { title: "New Title", stock: 123 };

      const response = await request.put(`/api/products/${productId}`)
                                    .set('Cookie', [jwtAdminCookie])
                                    .send(updatedProduct);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
    });

    it('should reflect the updated product details', async () => {
      const response = await request.get(`/api/products/${productId}`);
      expect(response.body.payload).to.have.property('title', 'New Title');
      expect(response.body.payload.stock).to.equal(123);
    });

    it('should allow an admin user to delete the product', async () => {
      const response = await request.delete(`/api/products/${productId}`)
                                    .set('Cookie', [jwtAdminCookie]);

      expect(response.status).to.equal(204);
    });
  });


});