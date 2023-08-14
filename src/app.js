import express from 'express';

import displayRoutes from 'express-routemap';
import { router as productRouter } from './routes/products.js';
import { router as cartRouter } from './routes/carts.js';
import { router as viewsRouter } from './routes/views.js';

import 'dotenv/config';
import path from 'path';
import handlebars from 'express-handlebars';

import connectDB from './config/dbConnection.js';

import { Server } from 'socket.io';
import { chatManager } from './config/config.js';

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

//db connection
connectDB();

//server initialization
const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running at PORT ${PORT}`);
});

//socket.io configuration
const io = new Server(httpServer);
io.on('connection', async (socket) => {
  console.log(`A user connected from socket: ${socket.id}`);

  socket.on('userIdentified', async (username) => {
    console.log(`User identified: ${username}`);
    let messagesWithUser = await chatManager.getMessages(username);
    socket.emit('chatHistory', messagesWithUser);
  });

  socket.on('newMessage', async (username, newMessage) => {
    await chatManager.addMessage(username, newMessage);
    let messagesWithUser = await chatManager.getMessages(username);
    socket.emit('chatHistory', messagesWithUser);
  });
});