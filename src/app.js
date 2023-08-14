import express from 'express';

import displayRoutes from 'express-routemap';
import { router as productRouter } from './routes/products.js';
import { router as cartRouter } from './routes/carts.js';
import { router as viewsRouter } from './routes/views.js';

import 'dotenv/config';
import path from 'path';
import handlebars from 'express-handlebars';

import connectDB from './config/dbConnection.js';
import configureSocketIO from './config/socketIO.js';

const PORT = process.env.PORT || 8080; 
const app = express();
const __dirname = path.resolve();

//express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//handlebars configuration
app.engine('hbs', handlebars.engine({ extname: '.hbs' })); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

//routes
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//error handling
app.use((err, req, res, next) => { 
  res.status(500).json({ status: 'error', payload: err.message });
});

app.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page does not exist' });
});  

//db connection
connectDB();

//server initialization
const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running at PORT ${PORT}`);
});

//socket.io configuration
configureSocketIO(httpServer);