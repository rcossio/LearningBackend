import { Router } from "express";
import {__dirname} from '../utils/dirname.js';
import productModel from "../models/products.model.js";
import cartModel from "../models/carts.model.js";

const router = Router()

router.get('/products', async (req,res) => {
    try {
        const {limit=10, page=1} = req.query
        const { docs, prevPage, nextPage, hasPrevPage, hasNextPage}  = await productModel.paginate({}, { lean:true, limit, page})

        res.render('products',{layout: 'main',products:docs, prevPage, nextPage, hasPrevPage, hasNextPage, page, limit})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/carts/:cartId', async (req,res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId).lean()
        console.log(cart)
        res.render('cart',{layout: 'main',products:cart.products})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/realtimeproducts', async (req,res) => {
    try {
        const products = await productModel.find().lean()
        res.render('realTimeProducts',{layout: 'main'})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.get('/login', async (req,res) => {
    try {
        const {emailError, passwordError} = req.query
        res.render('login',{layout: 'main',emailError, passwordError})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/register', async (req,res) => {
    try {
        res.render('register',{layout: 'main'})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.get('/profile', async (req,res) => {
    try {
        if (req.session.user === undefined) {
            res.json({status: 'error', payload: 'You are not logged in'})
        }
        
        const {firstName, lastName, email, age} = req.session.user

        res.render('profile',{firstName, lastName, email, age})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

export {router};