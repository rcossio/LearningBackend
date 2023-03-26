import { Router } from "express";
import userModel from "../models/users.model.js";
import {__dirname} from '../utils/dirname.js';

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
        const user = await userModel.findOne({email})

        if (!user) {
            res.redirect('/login?emailError=true') 
        }

        if (user.password !== password) {
            res.redirect('/login?passwordError=true') 
        }

        req.session.user = {firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age}

        res.render('profile',{
            firstName:user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age
            } )


    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.post('/register', async (req,res) => {
    try {
        const { firstName, lastName, email, age, password } = req.body
        const newUser = await userModel.create({firstName, lastName, email, age, password})
        res.redirect('/login')
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


export {router};