import { Router } from "express";
import cartModel from "../model/carts.model.js";


const router = Router()


router.get('/', async (req,res) => {
    try {
        const carts = await cartModel.find();
        res.json({status: 'success', payload: carts})
    } catch (error) {
        res.json({status: 'error', payload: error})
    } 
})


router.post('/', async (req,res) => {
    try{
        const cart = await cartModel.create(req.body)
        res.json({status: 'success', payload: cart})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.get('/:cartId', async (req,res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId)
        res.json({status: 'success', payload: cart}) 
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.post('/:cartId/product/:productId', async (req,res) => {
    try {
        let cartId = req.params.cartId;
        let productId = req.params.productId;
        
        const cart = await cartModel.findById(req.params.cartId)
        let newProductsArray = cart.products.map( item => { 
            if (item.product.toString() === productId) { 
                item.quantity++ 
            } 
            return item 
        })
        const newCart = await cartModel.updateOne({ _id: req.params.cartId }, { $set: { products: newProductsArray } } )
        res.json({status: 'success', payload: newCart})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})

export {router};