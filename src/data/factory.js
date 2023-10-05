import { config } from '../config/config.js';
import CustomError from '../services/customError.js';

let productDAO;
let cartDAO;
let userDAO;
let chatDAO;
let ticketDAO;

async function initialize() {
    const storageType = config.server.storageType;

    switch (storageType) {

        case 'mongo':
            const connectDB = (await import('../config/dbConnection.js')).default;
            await connectDB();

            productDAO = (await import('./mongo/dao/productsDAO.js')).default;
            cartDAO = (await import('./mongo/dao/cartsDAO.js')).default;
            userDAO = (await import('./mongo/dao/usersDAO.js')).default;
            chatDAO = (await import('./mongo/dao/chatDAO.js')).default;
            ticketDAO = (await import('./mongo/dao/ticketsDAO.js')).default;
            break;

        case 'fs':
            productDAO = (await import('./fs/productsDAO.js')).default;
            productDAO = new productDAO();

            cartDAO = (await import('./fs/cartsDAO.js')).default;
            cartDAO = new cartDAO();

            userDAO = (await import('./fs/usersDAO.js')).default;
            userDAO = new userDAO();

            chatDAO = (await import('./fs/chatDAO.js')).default;
            chatDAO = new chatDAO();

            break;

        default:
            throw new CustomError(`Unknown storage type: ${storageType}`,'INVALID_DATA');
    }
}

initialize()

export { productDAO, cartDAO, userDAO, chatDAO, ticketDAO };
