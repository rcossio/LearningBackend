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

describe('Views Router', function() {

  before(function() {
    this.timeout(5000); // Set a timeout of 10 seconds for all tests in this describe block
    return new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start
  });

  describe('GET /cart', () => {
    it('should return the list of products in the cart for a premium user', async () => {
      const jwtCookie = process.env.PREMIUM_USER_COOKIE

      const response = await request.get(`/cart`).set('Cookie', [`jwt=${jwtCookie}`]);
      expect(response.status).to.equal(200);
    });

  });
});
