import './utils/globalHandlers.js';
import 'dotenv/config';

import express from 'express';

import displayRoutes from 'express-routemap';
import { router as productRouter } from './routes/api/products.js';
import { router as cartRouter } from './routes/api/carts.js';
import { router as viewsRouter } from './routes/views.js';
import { router as authRouter } from './routes/auth.js';


import path from 'path';
import handlebars from 'express-handlebars';

import connectDB from './config/dbConnection.js';
import configureSocketIO from './config/socketIO.js';

import sessionMiddleware from './config/sessionsConfig.js';

import passport from './config/passportConfig.js';

const PORT = process.env.PORT || 8080; 
const app = express();
const __dirname = path.resolve();

//db connection
connectDB();

//express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//session configuration
app.use(sessionMiddleware);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

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

//routes
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//error handling
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).json({ status: 'error', payload: err.message });
});

app.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page does not exist' });
});  

//server initialization
const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running at PORT ${PORT}`);
});

//socket.io configuration
configureSocketIO(httpServer);