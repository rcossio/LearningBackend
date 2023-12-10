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

describe('Views Router', function() {
  let jwtPremiumUserCookie;
  
  before(async function() {
    this.timeout(5000); // Set a timeout of 10 seconds for all tests in this describe block
    await new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start

    jwtPremiumUserCookie = await getJwtCookie(process.env.PREMIUM_USER_EMAIL, process.env.PREMIUM_USER_PASS);
  });

  describe('GET /cart', () => {
    it('should return the list of products in the cart for a premium user', async () => {
      const response = await request.get(`/cart`).set('Cookie', [jwtPremiumUserCookie]);
      expect(response.status).to.equal(200);
    });

  });
});
