import express from 'express';
import ProductManager from './ProductManager.js';

const PORT = 8080;
const PRODUCT_DATA_FILE = './test/productManager.json';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(PRODUCT_DATA_FILE);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/products', (req, res) => {
  const {limit} = req.query;
  const products = productManager.getProducts().slice(0, limit?? 10);
  res.json(products);
});

app.get('/products/:productId', (req, res) => {
  const {productId} = req.params;
  try {
    const product = productManager.getProductById(Number(productId));
    res.json(product);
  } catch (error) {
    res.status(404).send(error.message);
  } 
});