import chatDAO from '../data/mongo/dao/chatDAO.js';

export const getChatHistory = async (username) => {
    return await chatDAO.getMessages(username);
};

export const addChatMessage = async (username, newMessage) => {
    await chatDAO.addMessage(username, newMessage);
    return await chatDAO.getMessages(username);
};

export const createNewChat = async (userEmail) => {
  return await chatDAO.createChat(userEmail);
};

export const assignChatToUser = async (userId, chatId) => {
  return await userDAO.createChat(userId, chatId);
};

export const getUserByEmail = async (email) => {
  return await userDAO.getUserByEmail(email);
};