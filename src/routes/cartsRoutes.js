import { CartManager } from "../utils.js";
import { Router } from "express";
import {__dirname} from '../path_utils.js';

const router = Router()

const CARTFILENAME=__dirname+'/carts.json';
let cartManager = new CartManager(CARTFILENAME);


router.get('/', (req,res) => {
    try {
        const carts = cartManager.getCarts()
        res.json({status: 'success', payload: carts})
    } catch (error) {
        res.json({status: 'error', payload: error})
    } 
})


router.post('/', (req,res) => {
    try{
        const {productsArray} = req.body
        let cart = cartManager.addCart({productsArray}) 
        res.json({status: 'success', payload: cart})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.get('/:cartId', (req,res) => {
    try {
        const cart = cartManager.getCartById(req.params.cartId)
        res.json({status: 'success', payload: cart}) 
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.post('/:cartId/product/:productId', (req,res) => {
    try {
        let cartId = req.params.cartId;
        let productId = req.params.productId;
        const cart = cartManager.addProductToCartByIds(cartId,productId)
        res.json({status: 'success', payload: cart})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})

export {router};