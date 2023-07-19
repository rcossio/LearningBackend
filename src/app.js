import express from 'express';
import displayRoutes from 'express-routemap';
import {router as productRouter} from './routes/products.js';
import {router as cartRouter} from './routes/carts.js';
import {router as viewsRouter} from './routes/views.js';
import path from 'path';
import handlebars from 'express-handlebars';

const PORT = 8080;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

app.get('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running at PORT ${PORT}`);
});