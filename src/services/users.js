import bcrypt from 'bcrypt';
//import userDAO from '../data/mongo/dao/usersDAO.js';
import {userDAO} from "../data/factory.js";
import CartsService from './carts.js';
import { config } from '../config/config.js';

class UserService {

    static async getUserByEmail(email) {
        const user = await userDAO.getUserByEmail(email);
        if (!user) {
            return null;
        }
        return user;
    }

    static async setUserPasswordByEmail(email, newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await userDAO.setUserPasswordByEmail(email, hashedPassword);
        if (result.nModified === 0) {
            throw new Error('Failed to update password or user not found.');
        }
        return result;
    }

    static async createChat(userId, chatId) {
        return await userDAO.createChat(userId, chatId); 
    }

    static async getUserById(id) {
        const user = await userDAO.getUserById(id);
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    }

    static async registerUser(req, email, password) {
        const existingUser = await this.getUserByEmail(email);

        if (existingUser) {
            throw new Error('User already exists.');
        }

        if (email.toLowerCase() === config.admin.email.toLowerCase()) {
            throw new Error('Admin already exists.');
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
            return {
                firstName: 'Admin',
                lastName: 'Admin',
                email: config.admin.email,
                role: 'admin'
            };
        }

        const user = await this.getUserByEmail(email);
        if (!user || user.password === undefined) {
            throw new Error('User not found or password undefined.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Password mismatch.');
        }

        return user;
    }

    static async githubAuth(profile) {
        const user = await this.getUserByEmail(profile.username);
        if (!user) {

            const cart = await CartsService.createCart();

            const newUser = {
                firstName: profile.username,
                lastName: `(${profile.provider})`,
                email: profile.username,
                cartId: cart._id
            };
            return await userDAO.addNewUser(newUser);
        }
        return user;
    }

    static async googleAuth(profile) {
        const user = await this.getUserByEmail(profile.emails[0].value);
        if (!user) {

            const cart = await CartsService.createCart();

            const newUser = {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                cartId: cart._id
            };
            return await userDAO.addNewUser(newUser);
        }
        return user;
    }
}

export default UserService;
