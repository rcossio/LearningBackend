import {__dirname} from './utils/dirname.js';
import express from 'express';
import * as mongoose from 'mongoose';
import { router as productsRoutes } from './routes/productsRoutes.js';
import { router as cartsRoutes } from './routes/cartsRoutes.js';
import { router as viewsRoutes } from './routes/viewsRoutes.js';
import { router as sessionRoutes } from './routes/sessionsRoutes.js';
import { router as basenameRoutes } from './routes/basenameRoutes.js';
import configureSocket from './sockets/webSocket.js';
import handlebars from 'express-handlebars';
import displayRoutes from 'express-routemap';
import { PORT, DB_ATLAS_USER, DB_ATLAS_NAME, DB_ATLAS_PASSWD, DB_ATLAS_DOMAIN, SESSION_SECRET } from './config/config.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import configurePassport from './config/passport.js';
import passport from 'passport';

// Express server
const app = express();

// Mongoose
mongoose.set('strictQuery', false);
const connection = mongoose
    .connect(`mongodb+srv://${DB_ATLAS_USER}:${DB_ATLAS_PASSWD}@${DB_ATLAS_DOMAIN}/${DB_ATLAS_NAME}?retryWrites=true&w=majority`)
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

// Session
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${DB_ATLAS_USER}:${DB_ATLAS_PASSWD}@${DB_ATLAS_DOMAIN}/${DB_ATLAS_NAME}?retryWrites=true&w=majority`,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 60 // 1 min for testing
            }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

// Routes
app.use('/',viewsRoutes);
const BASENAME = '/api'
app.use(BASENAME, basenameRoutes);
app.use(`${BASENAME}/sessions`, sessionRoutes);
app.use(`${BASENAME}/products`, productsRoutes);
app.use(`${BASENAME}/carts`, cartsRoutes);

// Mounting the server
const server = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`App listening to port ${PORT}. Go to http://localhost:8080. Note HTTPS is not supported, only HTTP.`)
})

// Socket.io
configureSocket(server)

// Passport
configurePassport();
app.use(passport.initialize())
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));
 
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user; //Is this necessary?
    res.redirect('/products');
  });
