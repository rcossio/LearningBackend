import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import { app } from '../../src/app.js'; 
import config from '../../src/config/config.js';
import UsersService from '../../src/services/users.js';

const { expect } = chai;
chai.use(chaiAsPromised);
const request = supertest(app);


describe('Auth Router', function() {
  let regularJwtToken;
  let premiumJwtToken;
  let adminJwtToken;
  const testUser = {
    firstName: 'TestName',
    lastName: 'TestLastName',
    email: 'user@test.com',
    age: 25,
    password: '123456',
  }
  
  before(async function() {
    await new Promise(resolve => setTimeout(resolve, 1000));  //wait 1 second for the server to start

    regularJwtToken = await setupUser('regular');
    premiumJwtToken = await setupUser('premium');
    adminJwtToken = await setupUser('admin');

  });

  afterEach(async function() {
    const user = await UsersService.getUserByEmail(testUser.email);
    if (user) {
      await UsersService.deleteUser(user._id);
    };
  });


  describe('Register Routes', () => {

    it('should return the register view', async () => {
      const response = await request.get('/auth/register');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('Register'); 
    });

    it('should register a new user', async () => {
      const response = await request.post('/auth/register').send(testUser);
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