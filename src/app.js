import express from 'express';

import displayRoutes from 'express-routemap';
import { router as productRouter } from './routes/products.js';
import { router as cartRouter } from './routes/carts.js';
import { router as viewsRouter } from './routes/views.js';
import { router as authRouter } from './routes/auth.js';
import { router as devRouter } from './routes/dev.js';
import { router as userRouter } from './routes/users.js';

import path from 'path';
import handlebars from 'express-handlebars';

import configureSocketIO from './config/socketIO.js';

import passport from './config/passportConfig.js';

import cookieParser from 'cookie-parser';
import expressjwt from "express-jwt";

import {config} from './config/config.js';

import logger from './utils/logger.js';
import './utils/globalHandlers.js';
/* process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
}); */

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

//express initialization
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

//swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Rworld API documentation',
      version: '1.0.0',
      description: 'Here we explain the API endpoins of this ecommerce',
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
}
const swaggerSpec = swaggerJSDoc(swaggerOptions);


//routes
app.use('/', viewsRouter);
app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/dev', devRouter);
app.use('/api/users', userRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//server initialization
const httpServer = app.listen(config.server.port, () => {
  //displayRoutes(app);
  logger.info(`Selected environment: ${config.server.mode}`);
  logger.info(`Server is running at PORT ${config.server.port}`);
});

//socket.io configuration
configureSocketIO(httpServer);

//error handling
app.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page does not exist' });
});  

export {app};