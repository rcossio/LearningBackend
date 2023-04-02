import { Router } from "express";
import userModel from "../models/users.model.js";
import {__dirname} from '../utils/dirname.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/config.js';
import * as bcrypt from 'bcrypt';
import passport from "passport";


const router = Router()

router.get('/logout', async (req,res) => {
    try {
        req.session.destroy()
        res.redirect('/login')   
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.post('/login', async (req,res) => {
    try {
        const { email, password } = req.body

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            req.session.user = {firstName: 'admin', lastName: 'admin', email, age: 'N/A', role: 'admin'}
            return res.redirect('/products')
        }

        const user = await userModel.findOne({email})

        if (!user) {
            return res.redirect('/login?emailError=true') 
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
            return res.redirect('/login?passwordError=true') 
        }

        if (req.session.user === undefined) {
            req.session.user = {firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, role: user.role}
        }
        if (req.session.user.email !== user.email) {
            req.session.user = {firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, role: user.role}
        }

        // I am not sure if this is better
        return res.redirect('/products')


    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.post('/register', async (req,res) => {
    try {

        const { firstName, lastName, email, age, password } = req.body

        const saltRounds = 10;
        const hashed_password = bcrypt.hashSync(password, saltRounds);

        const newUser = await userModel.create({firstName, lastName, email, age, password:hashed_password, role:'user'})
        return res.redirect('/login')
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));
 
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user;
    return res.redirect('/products');
  });

export {router};