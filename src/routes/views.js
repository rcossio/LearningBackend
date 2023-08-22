import { Router } from "express";
import { productManager, cartManager, userManager } from "../config/config.js";
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';


const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const { limit = 3, page = 1, sort = 'asc', query = '' } = req.query;
  const sortOrder = sort === 'desc' ? -1 : 1;
  
  const filter = { status: true };
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

  const result = await productManager.getProducts(filter, options);

  if (result.docs.length === 0) { 
    return res.status(404).render('error', { message: 'Page does not exist' });
  }

  res.status(200).render('home', { ...result, sort, query, user: req.session.user });
}));

router.get('/carts/:cartId', asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);
  res.status(200).render('cart', cart);
}));

router.get("/chat", (req, res) => {
  res.render('chat');
}); 


//Login and Register
router.get("/register", asyncHandler(async (req, res) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  
  res.render('register');
}));


router.post("/register", asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password, age } = req.body;

  const existingUser = await userManager.getUserByEmail(email);
  if (existingUser) {
    return res.render('login', { error: 'User already exists. Please login.' });
  }

  const saltRounds = 1; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    age: age,
    password: hashedPassword
  };

  await userManager.addNewUser(newUser);
  res.redirect('/login');
}));


router.get("/login", asyncHandler(async (req, res) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }

  res.render('login');
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email.toLowerCase() === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    req.session.user = {
      firstName: 'Admin', 
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL, 
      role: 'admin' 
    };

    return res.redirect('/');
  }

  const user = await userManager.getUserByEmail(email);
  if (!user) {
    return res.render('register', { error: 'User is not registered. Please register.' });
  }

  const isMatch = await bcrypt.compare(password, user.password); // Assuming bcrypt is used
  if (!isMatch) {
    return res.render('login', { error: 'Invalid credentials' });
  }
  
  req.session.user = user;
  return res.redirect('/');
}));

router.get("/profile", asyncHandler(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('profile', { user: req.session.user });
}));

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
        console.log(err);
        res.render('profile', { error: 'Unable to log out' });
    } else {
    res.render('login', { message: 'Log out successful' });
    }
})});

export { router };