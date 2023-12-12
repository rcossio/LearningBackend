import bcrypt from 'bcrypt';
import {userDAO} from "../data/factory.js";
import CartsService from './carts.js';
import config from '../config/config.js';
import CustomError from './customError.js';

class UserService {

    static async getUserById(id) {
        return await userDAO.getUserById(id);
    }

    static async getUserByEmail(email) {
        try {
            const user = await userDAO.getUserByEmail(email);
            return user
        } catch (error) {
            throw new CustomError('User not found.', 'INVALID_DATA');
        }
    }

    static async registerUser(userDTO) {
        let existingUser;
        try {
            existingUser = await this.getUserByEmail(userDTO.email);
        } catch (error) {
            if (error.message !== 'User not found.') {
                throw error; 
            }
        }
    
        if (existingUser) {
            throw new CustomError('User already exists.', 'INVALID_DATA');
        }
    
        if (userDTO.email.toLowerCase() === config.admin.email.toLowerCase()) {
            throw new CustomError('Admin already exists.', 'INVALID_DATA');
        }
    
        const hashedPassword = await bcrypt.hash(userDTO.password, 10);
        const cart = await CartsService.createCart();
        const newUser = {
            firstName: userDTO.firstName,
            lastName: userDTO.lastName,
            email: userDTO.email,
            age: userDTO.age,
            password: hashedPassword,
            cartId: cart._id
        }; 
        
        return await userDAO.addNewUser(newUser);
    }    

    static async loginUser(email, password) {
        if (email.toLowerCase() === config.admin.email && password === config.admin.pass) {
            const adminUser = {
                _id: 0,
                firstName: 'Admin',
                lastName: 'Admin',
                email: config.admin.email,
                role: 'admin'
            };
            return adminUser;
        }

        const user = await this.getUserByEmail(email);
        if (!user.password) {
            throw new CustomError('Wrong authentication method.', 'AUTH_ERROR');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError('Password mismatch.', 'INVALID_DATA');
        }

        return user;
    }

    static async loginOrCreateUser(userDTO) {
        const user = await this.getUserByEmail(userDTO.email);
        if (user) {
            return user;
        }
        const cart = await CartsService.createCart();
        const newUser = { ...userDTO, cartId: cart._id };
        return await userDAO.addNewUser(newUser);
    }

    static async setUserPasswordByEmail(email, newPassword) {
        const user = await userDAO.getUserByEmail(email);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        return await userDAO.updateUserById(user._id, {password: hashedPassword});
    }

    static async createChat(userId, chatId) {
        const user = await userDAO.getUserById(userId);
        user.chatId = chatId;
        return await userDAO.updateUserById(userId, user);
    }

    static async userUpgradeToPremium(userId) {
        const user = await userDAO.getUserById(userId);
        return await userDAO.updateUserById(userId, {role: 'premium'});
    }

    static async updateLoginDate(userId) {
        const user = await userDAO.getUserById(userId);
        const date = new Date()
        return await userDAO.updateUserById(userId, {last_connection: date});
    }

    static async deleteUser(userId) {
        return await userDAO.deleteUser(userId);
    }

    static getUserData(user) {
        const userDTO = {
          _id: user.id,
          cartId: user.cartId,
          chatId: user.chatId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          age: user.age,
        };
    
        return userDTO;
      }
}

export default UserService;
