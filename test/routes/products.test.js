import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { app } from '../../src/app.js'; 

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
      }
    });
  });

});
