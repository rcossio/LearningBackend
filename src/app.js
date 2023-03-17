import express from 'express';
import { router as productsRoutes } from './routes/productsRoutes.js';
import { router as cartsRoutes } from './routes/cartsRoutes.js';
import { router as viewsRoutes } from './routes/viewsRoutes.js';
import { router as apiRoutes } from './routes/apiRoutes.js';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import {__dirname} from './path_utils.js';
import * as mongoose from 'mongoose';
import displayRoutes from 'express-routemap';
import {PORT, DB_HOST, DB_NAME, DB_PORT} from './config/config.js';

// Express server
const BASENAME = '/api'
const app = express();

mongoose.set('strictQuery', false);
const connection = mongoose
    .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err))

// Handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


// Express middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(express.static(__dirname+'/public'))

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/',viewsRoutes);
app.use(BASENAME, apiRoutes);
app.use(`${BASENAME}/products`, productsRoutes);
app.use(`${BASENAME}/carts`, cartsRoutes);

// Mounting the server
const server = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`App listening to port ${PORT}. Go to http://localhost:8080. Note HTTPS is not supported, only HTTP.`)
})

// Socket.io
// TODO: Put this block in a separate file
// FIX: This will raise an error since productManager is not defined
const io = new Server(server)
io.on('connection', (socket)=> {
    console.log("A user has connected")
    socket.emit('realTimeProducts', productManager.getProducts().products)
    socket.on("update",(data) => {
        socket.emit('realTimeProducts', productManager.getProducts().products)
    })
})

// THIS IS TO CONNECT TO MONGODB ATLAS
/* const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://radossio:<password>@cluster0.hgqsmv1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */