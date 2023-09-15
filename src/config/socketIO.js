import { Server } from 'socket.io';
import { getChatHistory, addChatMessage } from '../services/chat.js';

const configureSocketIO = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    console.log(`A user connected from socket: ${socket.id}`);

    socket.on('userIdentified', async (username) => {
      console.log(`User identified: ${username}`);
      const messagesWithUser = await getChatHistory(username);
      socket.emit('chatHistory', messagesWithUser);
    });

    socket.on('newMessage', async (username, newMessage) => {
      const messagesWithUser = await addChatMessage(username, newMessage);
      socket.emit('chatHistory', messagesWithUser);
    });
  });
};

export default configureSocketIO;
