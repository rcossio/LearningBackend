import express from 'express';
import { router as productsRoutes } from './routes/productsRoutes.js';
import { router as cartsRoutes } from './routes/cartsRoutes.js';
import { router as viewsRoutes } from './routes/viewsRoutes.js';
import { router as apiRoutes } from './routes/apiRoutes.js';
import configureSocket from './websocket/webSocket.js';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
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
configureSocket(server)


// THIS IS TO CONNECT TO MONGODB ATLAS 
// ACCORDING TO ATLAS DOCUMENTATION
// I HAVE NEVER TESTED IT
/* const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://radossio:<password>@cluster0.hgqsmv1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */