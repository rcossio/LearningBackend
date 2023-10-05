import bcrypt from 'bcrypt';
import {userDAO} from "../data/factory.js";
import CartsService from './carts.js';
import { config } from '../config/config.js';
import CustomError from './customError.js';

class UserService {

    static async getUserByEmail(email) {
        return await userDAO.getUserByEmail(email);
    }

    static async setUserPasswordByEmail(email, newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        return await userDAO.setUserPasswordByEmail(email, hashedPassword);
    }

    static async createChat(userId, chatId) {
        return await userDAO.createChat(userId, chatId); 
    }

    static async getUserById(id) {
        return await userDAO.getUserById(id);
    }

    static async registerUser(req, email, password) {
        const existingUser = await this.getUserByEmail(email);

        if (existingUser) {
            throw new CustomError('User already exists.', 'INVALID_DATA');
        }

        if (email.toLowerCase() === config.admin.email.toLowerCase()) {
            throw new CustomError('Admin already exists.', 'INVALID_DATA');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const cart = await CartsService.createCart();
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            age: req.body.age,
            password: hashedPassword,
            cartId: cart._id
        };
        
        return await userDAO.addNewUser(newUser);
    }

    static async loginUser(email, password) {
        if (email.toLowerCase() === config.admin.email && password === config.admin.pass) {
            const adminUser = {
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

    static async githubAuth(profile) {
        const user = await this.getUserByEmail(profile.username);

        if (user) {
            return user;
        }

        const cart = await CartsService.createCart();

        const newUser = {
            firstName: profile.username,
            lastName: `(${profile.provider})`,
            email: profile.username,
            cartId: cart._id
        };
        return await userDAO.addNewUser(newUser);
        
    }

    static async googleAuth(profile) {
        const user = await this.getUserByEmail(profile.emails[0].value);

        if (user) {
            return user;
        }

        const cart = await CartsService.createCart();

        const newUser = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            cartId: cart._id
        };
        
        return await userDAO.addNewUser(newUser);
        
    }
}

export default UserService;
