import { Router } from "express";
import productModel from "../models/products.model.js";

const router = Router()

router.get('/', async (req,res) => {
    try {
        let { minPrice, maxPrice, minStock, maxStock, limit=10, page=1, sort=null, available } = req.query
        
        const filters = {}
        minPrice && (filters.price = { $gte: minPrice })
        maxPrice && (filters.price = { $lte: maxPrice, ...filters.price })
        minStock && (filters.stock = { $gte: minStock })
        maxStock && (filters.stock = { $lte: maxStock, ...filters.stock })
        available && (filters.status = { $eq: available })

        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage}  = await productModel.paginate(filters, 
            {
                limit, 
                page,
                sort: sort==='asc' ?    //TO FIX: sometimes sorting fails
                    { _id: 1, price: 1} 
                    : sort==='desc'?
                        { _id: 1, price: -1}
                        : null
            })
        
        let prevLink= prevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}` : null;
        let nextLink= nextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}` : null;

        res.json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        })
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.get('/:productId', async (req,res) => {
    try {
        const product = await productModel.findById(req.params.productId)
        res.json({status: 'success', payload: product}) 
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.post('/',async (req,res) => {
    try {
        const result = await productModel.create(req.body)  
        res.json({status: 'success', payload: result})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.put('/:productId', async (req,res)=>{
    try{
        const product = await productModel.updateOne({ _id: req.params.productId }, { $set: req.body } )
        res.json({status: 'success', payload: product})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }
})


router.delete('/:productId', async (req,res)=>{
    try {
        const result = await productModel.deleteOne({ _id: req.params.productId })
        res.json({status: 'success', payload: result})
    } catch (error) {
        res.json({status: 'error', payload: error.toString()})
    }    
})

export {router};