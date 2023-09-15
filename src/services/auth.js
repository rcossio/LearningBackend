import bcrypt from 'bcrypt';
import userDAO from '../data/mongo/dao/userDAO.js';
import { config } from '../config/config.js';


export const getUserByEmail = async (email) => {
    return await userDAO.getUserByEmail(email);
};

export const setUserPasswordByEmail = async (email, newPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    return await userDAO.setUserPasswordByEmail(email, hashedPassword);
};

export async function registerUser(req, email, password) {
    const existingUser = await userDAO.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        age: req.body.age,
        password: hashedPassword
    };
    return await userDAO.addNewUser(newUser);
}

export async function loginUser(email, password) {
    if (email.toLowerCase() === config.admin.email && password === config.admin.pass) {
        return {
            firstName: 'Admin',
            lastName: 'Admin',
            email: config.admin.email,
            role: 'admin'
        };
    }

    const user = await userDAO.getUserByEmail(email);
    if (!user || user.password === undefined) {
        throw new Error('User not found or password undefined.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password mismatch.');
    }

    return user;
}

export async function githubAuth(profile) {
    const user = await userDAO.getUserByEmail(profile.username);
    if (!user) {
        const newUser = {
            firstName: profile.username,
            lastName: `(${profile.provider})`,
            email: profile.username
        };
        return await userDAO.addNewUser(newUser);
    }
    return user;
}

export async function googleAuth(profile) {
    const user = await userDAO.getUserByEmail(profile.emails[0].value);
    if (!user) {
        const newUser = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
        };
        return await userDAO.addNewUser(newUser);
    }
    return user;
}
