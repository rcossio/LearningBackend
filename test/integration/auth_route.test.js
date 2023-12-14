import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { app } from '../../src/app.js'; 
import dotenv from 'dotenv';
import path from 'path';
import UserDAO from '../../src/data/mongo/dao/usersDAO.js';

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

describe('Auth Router', function() {
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

  describe('Register Routes', () => {

    after(async () => {
      const user = await UserDAO.getUserByEmail('user@test.com');
      if (user) {
        await UserDAO.deleteUser(user._id);
      };
    });

    it('should return the register view', async () => {
      const response = await request.get('/auth/register');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Register'); 
    });

    it('should register a new user', async () => {
      const newUser = {
        firstName: 'TestName',
        lastName: 'TestLastName',
        email: 'user@test.com',
        age: 25,
        password: '123456',
      }

      const response = await request.post('/auth/register').send(newUser);
      expect(response.status).to.equal(302);
      expect(response.headers.location).to.equal('/auth/register/success');
    });

    it('should return the register confirmation view', async () => {
      const response = await request.get('/auth/register/success');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('User registered successfully'); 
    });

    it('should return the register failure view', async () => {
      const response = await request.get('/auth/register/failed');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Unable to register user'); 
    });

  });


  describe('Login Routes', () => {
    it('should return the login view', async () => {
      const response = await request.get('/auth/login');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Login'); 
    });

    it('should log in an existing user', async () => {
      const existingUser = {
        email: process.env.REGULAR_USER_EMAIL,
        password: process.env.REGULAR_USER_PASS,
      }

      const response = await request.post('/auth/login').send(existingUser);
      expect(response.status).to.equal(302);
      expect(response.headers.location).to.equal('/');
    });

    it('should return the failed login view', async () => {
      const response = await request.get('/auth/login/failed');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Unable to log in'); 
    });

  });

});