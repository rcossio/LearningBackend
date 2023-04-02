import { Router } from "express";
import {__dirname} from '../utils/dirname.js';
import productModel from "../models/products.model.js";
import cartModel from "../models/carts.model.js";

const router = Router()

router.get('/products', async (req,res) => {
    try {
        if (req.session.user === undefined) {
            return res.redirect('/login?loginError=true')
        }

        const {limit=10, page=1} = req.query
        const { docs, prevPage, nextPage, hasPrevPage, hasNextPage}  = await productModel.paginate({}, { lean:true, limit, page})

        const {firstName, lastName, email, age, role} = req.session.user


        return res.render('products',{layout: 'main',products:docs, prevPage, nextPage, hasPrevPage, hasNextPage, page, limit, firstName, lastName, email, age, role})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/carts/:cartId', async (req,res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId).lean()
        console.log(cart)
        return res.render('cart',{layout: 'main',products:cart.products})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/realtimeproducts', async (req,res) => {
    try {
        if (req.session.user === undefined) {
            return res.redirect('/login?loginError=true')
        }
        const products = await productModel.find().lean()
        return res.render('realTimeProducts',{layout: 'main'})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})


router.get('/login', async (req,res) => {
    try {
        const {emailError, passwordError, loginError} = req.query
        return res.render('login',{emailError, passwordError, loginError})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/register', async (req,res) => {
    try {
        return res.render('register',{layout: 'main'})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/profile', async (req,res) => {
    try {
        if (req.session.user === undefined) {
            return res.redirect('/login?loginError=true')
        }
        
        const {firstName, lastName, email, age, role} = req.session.user

        return res.render('profile',{firstName, lastName, email, age, role})
    } catch (error) {
        return res.json({status: 'error', payload: error.toString()})
    }
})

export {router};