import express from 'express';
import { router as productsRoutes } from './routes/productsRoutes.js';
import { router as cartsRoutes } from './routes/cartsRoutes.js';
import { router as viewsRoutes } from './routes/viewsRoutes.js';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

const PORT = 8080;
const BASENAME = '/api'

const app = express();

app.engine('handlebars',handlebars.engine())
app.set('views','./views')
app.set('view engine','handlebars')

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());

app.use(express.static('./public'))

let welcomeHTML = `<h4> The API is alive</h4>
                <p> Go to ${BASENAME}/products route to browse products or to ${BASENAME}/products/ID if you know the ID of the product </p>` 

function mid1(req,res,next){
    console.log('Somebody visited the API at time:', Date.now())
    next()
}

app.get(BASENAME, mid1, (req,res) => { 
    res.send(welcomeHTML) 
})

app.use('/',viewsRoutes);
app.use(`${BASENAME}/products`, productsRoutes);
app.use(`${BASENAME}/carts`, cartsRoutes);

const server = app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}. Go to http://localhost:8080. Note HTTPS is not supported, only HTTP.`)
})

const io = new Server(server)
io.on('connection', (socket)=> {
    console.log("Websocket connectet")
})