import { Router } from "express";
import productModel from "../model/products.model.js";

const router = Router()

router.get('/', async (req,res) => {
    try {
        let { minPrice, maxPrice, minStock, maxStock, limit } = req.query
        
        const defaultLimit = 10
        const filters = {}
        minPrice && (filters.price = { $gte: minPrice })
        maxPrice && (filters.price = { $lte: maxPrice, ...filters.price })
        minStock && (filters.stock = { $gte: minStock })
        maxStock && (filters.stock = { $lte: maxStock, ...filters.stock })

        const products = await productModel.find(filters).limit(limit? limit: defaultLimit);
        res.json({status: 'success', payload: products})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.get('/:productId', async (req,res) => {
    try {
        const product = await productModel.findById(req.params.productId)
        res.json({status: 'success', payload: product}) 
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.post('/',async (req,res) => {
    try {
        const result = await productModel.create(req.body)  
        res.json({status: 'success', payload: result})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.put('/:productId', async (req,res)=>{
    try{
        const product = await productModel.updateOne({ _id: req.params.productId }, { $set: req.body } )
        res.json({status: 'success', payload: product})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.delete('/:productId', async (req,res)=>{
    try {
        const result = await productModel.deleteOne({ _id: req.params.productId })
        res.json({status: 'success', payload: result})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }    
})

export {router};