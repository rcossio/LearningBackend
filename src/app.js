import './utils/globalHandlers.js';

import express from 'express';

import displayRoutes from 'express-routemap';
import { router as productRouter } from './routes/products.js';
import { router as cartRouter } from './routes/carts.js';
import { router as viewsRouter } from './routes/views.js';
import { router as authRouter } from './routes/auth.js';

import path from 'path';
import handlebars from 'express-handlebars';

import configureSocketIO from './config/socketIO.js';

import passport from './config/passportConfig.js';

import cookieParser from 'cookie-parser';
import expressjwt from "express-jwt"; 

import {config} from './config/config.js';

console.log(config)
const PORT = config.server.port; 
const app = express();
const __dirname = path.resolve();

//express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//passport initialization
app.use(passport.initialize());

//handlebars configuration
app.engine('hbs', handlebars.engine(
  { 
    extname: '.hbs',
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    partialsDir: path.join(__dirname, 'src/views/partials'),
  })); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// Use the cookie parser to get cookies from requests
app.use(cookieParser());

// JWT middleware
app.use(expressjwt({
    secret: config.auth.jwtSecret,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: req => req.cookies.jwt
}));

//routes
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//server initialization
const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running at PORT ${PORT}`);
});

//socket.io configuration
configureSocketIO(httpServer);

//error handling
app.use((err, req, res, next) => { 
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ status: 'error', payload: 'Invalid or expired token' });
  }

  console.error(err.stack);
  res.status(500).json({ status: 'error', payload: err.message });
});

app.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page does not exist' });
});  