import express from 'express';
import { router as productsRoutes } from './routes/productsRoutes.js';
import { router as cartsRoutes } from './routes/cartsRoutes.js';

const PORT = 8080;
const BASENAME = '/api'

const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());

let welcomeHTML = `<h4> The API is alive</h4>
                <p> Go to ${BASENAME}/products route to browse products or to ${BASENAME}/products/ID if you know the ID of the product </p>` 


app.get(BASENAME, (req,res) => { res.send(welcomeHTML) })

app.use(`${BASENAME}/products`, productsRoutes);
app.use(`${BASENAME}/carts`, cartsRoutes);

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}. Go to http://localhost:8080. Note HTTPS is not supported, only HTTP.`)
})
