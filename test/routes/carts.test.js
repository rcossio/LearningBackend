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

describe('Cart Router', function() {
  let jwtAdminCookie;
  let jwtUserCookie;
  let cartId;
  let productId = "64b97c687084efd5376dab4c"; // Valid product ID with stock

  before(async function() {
    this.timeout(5000); // Set a timeout of 5 seconds for all tests in this describe block
    await new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start

    jwtAdminCookie = await getJwtCookie(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
    jwtUserCookie = await getJwtCookie(process.env.REGULAR_USER_EMAIL, process.env.REGULAR_USER_PASS);
  });

  describe('Admin Cart Management', () => {
    it('should create a new cart', async () => {
      const response = await request.post('/api/carts').set('Cookie', [jwtAdminCookie]);
      expect(response.status).to.equal(201);
      cartId = response.body.payload._id; 
    });

    it('should get a cart by ID', async () => {
      const response = await request.get(`/api/carts/${cartId}`).set('Cookie', [jwtAdminCookie]);
      expect(response.status).to.equal(200);
      expect(response.body.payload._id).to.equal(cartId);
    });

    it('should update product quantity in the cart', async () => {
      const response = await request.put(`/api/carts/${cartId}/product/${productId}`).set('Cookie', [jwtAdminCookie]).send({ quantity: 5 }); // Setting new quantity
    
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.equal('Product quantity updated successfully');
    });
    

    it('should update a cart', async () => {
      const updateData = {
        products: [
          { productId, quantity: 2 }
        ]
      };
    
      const response = await request.put(`/api/carts/${cartId}`).set('Cookie', [jwtAdminCookie]).send(updateData);
    
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.be.an('object');
      expect(response.body.payload.products[0].productId).to.equal('64b97c687084efd5376dab4c');
    });
    
    it('should delete a cart', async () => {
      const response = await request.delete(`/api/carts/${cartId}`).set('Cookie', [jwtAdminCookie]);
    
      expect(response.status).to.equal(204);
    });        
    
  });

  describe('User Cart Management', () => {
    let user;

    before(async () => {
      const baseResponse = await request.get('/api/users/current').set('Cookie', [jwtUserCookie]);
      user = baseResponse.body.payload; 
    });

    it('should add a product to the cart', async () => {
      const response = await request.post(`/api/carts/${user.cartId}/product/${productId}/increase`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(302);
      expect(response.headers.location).to.equal('/cart'); //this redirection means successful adding
    });

    it('should delete a product from the cart', async () => {
      const response = await request.post(`/api/carts/${user.cartId}/product/${productId}`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(302);
      expect(response.headers.location).to.equal('/cart'); //this redirection means successful adding
    });

    it('should successfully purchase items in the cart and redirect', async () => {
      await request.post(`/api/carts/${user.cartId}/product/${productId}/increase`).set('Cookie', [jwtUserCookie]); //we make sure there is a product
      const response = await request.post(`/api/carts/${user.cartId}/purchase`).set('Cookie', [jwtUserCookie]);
  
      expect(response.status).to.equal(302);
      expect(response.headers.location).to.include('/purchase-successful');
    });
  
  });


});
