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
  let jwtUserCookie;
  let jwtAdminCookie;
  
  before(async function() {
    this.timeout(5000); // Set a timeout of 10 seconds for all tests in this describe block
    await new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start

    jwtPremiumUserCookie = await getJwtCookie(process.env.PREMIUM_USER_EMAIL, process.env.PREMIUM_USER_PASS);
    jwtUserCookie = await getJwtCookie(process.env.REGULAR_USER_EMAIL, process.env.REGULAR_USER_PASS);
    jwtAdminCookie = await getJwtCookie(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
  });

  describe('Public Routes', () => {
    it('should return the home page', async () => {
      const response = await request.get(`/`);
      expect(response.status).to.equal(200);
    });

    it('should return the not-authorized page', async () => {
      const response = await request.get(`/not-authorized`);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('You are not authorized to access this resource'); 
    });
  });

  describe('User Routes', () => {
    it('should return the cart view for a user', async () => {
      const response = await request.get(`/cart`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Products in cart'); 
    });

    it('should return the chat view for a user', async () => {
      const response = await request.get(`/chat`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Chat with us');
    });

    it('should return the purchase successful view for a valid ticket code', async () => {
      const validTicketCode = '99cb9622-cdc3-4996-9bba-dfa736bdd0fa'; //valid ticket code for regular user
      const response = await request.get(`/purchase/success/${validTicketCode}`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Your purchase was successful!');
    });
  
    it('should return the purchase failed view', async () => {
      const response = await request.get('/purchase-failed').set('Cookie', [jwtPremiumUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Error while purchasing the cart');
    });

    it('should return the cart modification failed view', async () => {
      const response = await request.get('/cart-modification-failed').set('Cookie', [jwtPremiumUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Unable to modify cart');
    });
  });

  describe('User and Admin Routes', () => {
    it('should return the profile view for a regular user', async () => {
      const response = await request.get(`/profile`).set('Cookie', [jwtUserCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Welcome,');
    });

    it('should return the profile view for an admin', async () => {
      const response = await request.get(`/profile`).set('Cookie', [jwtAdminCookie]);
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Welcome,'); 
    });
  });
});