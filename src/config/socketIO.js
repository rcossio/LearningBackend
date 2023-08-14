import { chatManager } from './config.js';
import { Server } from 'socket.io';

const configureSocketIO = (httpServer) => {
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
};

export default configureSocketIO;
