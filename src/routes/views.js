import { Router } from "express";
import { productManager, cartManager, userManager } from "../config/config.js";
import bcrypt from 'bcrypt';
import 'dotenv/config';
import passport from '../config/passportConfig.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
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
  
    res.status(200).render('home', { ...result, sort, query, user: req.user });

  } catch (error) { 
      return res.status(400).render('home', { error: error.message, page:1, totalPages:1 });
  }


});

router.get('/carts/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).render('cart', cart);
  } catch (error) {
    res.render('cart', { error: error.message });
  }

});


// Add to cart functionaliy
router.get('/my-cart', async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
    const cart = await cartManager.getCartByUserId(req.user);
    res.status(200).render('cart', {...cart, user: req.user});
  } catch (error) {
    res.render('cart', { error: error.message });
  }
});

router.get('/add-to-my-cart/:productId', async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
    const cart = await cartManager.getCartByUserId(req.user);
    await cartManager.addProductToCart(cart._id, req.params.productId, 1, productManager);
    res.status(200).redirect('/my-cart');
  } catch (error) {
    res.render('home', { error: error.message });
  }
});


//Chat
router.get("/chat", (req, res) => {
  res.render('chat');
}); 


// Registration
router.get("/register", async (req, res) => {
  if (req.user) {
    return res.redirect('/profile');
  }
  
  res.render('register');
});

router.post("/register", passport.authenticate('signupStrategy', {
  successRedirect: '/registered-successfully',
  failureRedirect: '/registered-failed',
}));

router.get("/registered-successfully", async (req, res) => {
  res.render('login', { message: 'User registered successfully. Please log in' });
});

router.get("/registered-failed", async (req, res) => {
  return res.render('register', { error: 'Unable to register user.' });
});

//Github auth
router.get("/auth-github", passport.authenticate('githubStrategy'));

router.get("/auth/github/callback", passport.authenticate('githubStrategy', {
  successRedirect: '/',
  failureRedirect: '/login-failed',
}));

//Google auth
router.get("/auth-google", passport.authenticate('googleStrategy',{ scope: ['profile','email'] }));

router.get("/auth/google/callback", passport.authenticate('googleStrategy', {
  successRedirect: '/',
  failureRedirect: '/login-failed',
}));


// Login
router.get("/login", async (req, res) => {
  try{
    if (req.user) {
      return res.redirect('/profile');
    }
  
    res.render('login');
  } catch (error) {
    res.render('login',{ error: error.message });

  }

});

router.post("/login", passport.authenticate('loginStrategy', {
  successRedirect: '/',
  failureRedirect: '/login-failed',
}));

router.get("/login-failed", async (req, res) => {
  return res.render('login', { error: 'Unable to log in' });
});


// Profile
router.get("/profile", async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
  
    res.render('profile', { user: req.user });
  } catch (error) {
    res.render('profile', { error: error.message });

  }

});

// Logout
router.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.render('profile', { error: 'Unable to log out' });
    } else {
      return res.redirect('/');
    }
  });
});


// Restore password
router.get("/restore-password", (req, res) => {
  res.render('restore-password');
});

router.post("/restore-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.render('restore-password', { error: 'Password was not updatedPassword was not updated.' });
    }

    if (newPassword !== confirmPassword) {
      return res.render('restore-password', { error: 'Passwords do not match!' });
    }

    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds).then( async (hashedPassword) => {
        await userManager.setUserPasswordByEmail(email, hashedPassword);
        res.render('login', { message: 'Password updated successfully. Please log in with your new password.' });
    });

  } catch (error) {
    res.render('restore-password', { error: error.message });
  }
});


export { router };