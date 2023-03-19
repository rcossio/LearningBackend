import { Router } from "express";
import cartModel from "../model/carts.model.js";


const router = Router()


router.get('/', async (req,res) => {
    try {
        const carts = await cartModel.find();
        res.json({status: 'success', payload: carts})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    } 
})


router.post('/', async (req,res) => {
    try{
        const cart = await cartModel.create(req.body)
        res.json({status: 'success', payload: cart})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.get('/:cartId', async (req,res) => {
    try {
        const cart = await cartModel.findById(req.params.cartId)
        res.json({status: 'success', payload: cart}) 
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.put('/:cartId', async (req,res) => {
    try {
        const {newProductsArray} = req.body
        const result = await cartModel.updateOne({ _id: req.params.cartId }, { $set: { products: newProductsArray } } )
        res.json({status: 'success', payload: result}) 
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

router.delete('/:cartId', async (req,res) => {
    try {
        const result = await cartModel.deleteOne({ _id: req.params.cartId })
        res.json({status: 'success', payload: result}) 
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


//TO DO: This should be handles by a cartManager class or similar
router.put('/:cartId/product/:productId', async (req,res) => {
    try {
        let cartId = req.params.cartId;
        let productId = req.params.productId;
        const {quantity} = req.body
        
        const cart = await cartModel.findById(req.params.cartId)
        let newProductsArray = cart.products.map( item => { 
            if (item.product._id.toString() === productId) { 
                item.quantity = quantity
            } 
            return item 
        })
        const newCart = await cartModel.updateOne({ _id: req.params.cartId }, { $set: { products: newProductsArray } } )
        res.json({status: 'success', payload: newCart})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})

//TO DO: This should be handles by a cartManager class or similar
router.post('/:cartId/product/:productId', async (req,res) => {
    try {
        let cartId = req.params.cartId;
        let productId = req.params.productId;
        
        const cart = await cartModel.findById(req.params.cartId)
        let newProductsArray = cart.products.map( item => { 
            if (item.product._id.toString() === productId) { 
                item.quantity++ 
            } 
            return item 
        })
        const newCart = await cartModel.updateOne({ _id: req.params.cartId }, { $set: { products: newProductsArray } } )
        res.json({status: 'success', payload: newCart})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


//TO DO: This should be handles by a cartManager class or similar
router.delete('/:cartId/product/:productId', async (req,res) => {
    try {
        let cartId = req.params.cartId;
        let productId = req.params.productId;
        
        const cart = await cartModel.findById(req.params.cartId)

        let newProductsArray = cart.products.filter( (item) => item.product._id.toString() !== String(productId))

        const result = await cartModel.updateOne({ _id: req.params.cartId }, { $set: { products: newProductsArray } } )
        res.json({status: 'success', payload: result})
    } catch (error) {
        console.log(error)
        res.json({status: 'error', payload: error.toString()})
    }
})

export {router};