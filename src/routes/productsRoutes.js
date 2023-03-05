import { Router } from "express";
import { productManager } from "../app.js";

const router = Router()

function filterProducts (products,{ includesString, minPrice, maxPrice, minStock, maxStock, limit }) {
    minPrice && (products = products.filter((item) => item.price >= minPrice) )
    maxPrice && (products = products.filter((item) => item.price <= maxPrice) )
    minStock && (products = products.filter((item) => item.stock >= minStock) )
    maxStock && (products = products.filter((item) => item.stock <= maxStock) )
    limit && (products = products.slice(0,limit) )
    includesString && (products = products.filter((item) => (item.title.includes(includesString) || item.description.includes(includesString)) ) )

    return products
}

router.get('/', (req,res) => {
    try {
        let { includesString, minPrice, maxPrice, minStock, maxStock, limit } = req.query
        const products = productManager.getProducts()
        let filteredProducts = filterProducts(products, {includesString, minPrice, maxPrice, minStock, maxStock, limit} )
        res.json({status: 'success', payload: filteredProducts})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.get('/:productId', (req,res) => {
    try {
        const product = productManager.getProductById(req.params.productId)
        res.json({status: 'success', payload: product}) 
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.post('/', (req,res) => {
    try {
        const product = productManager.addProduct(req.body)   
        res.json({status: 'success', payload: product})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


router.put('/:productId', (req,res)=>{
    try{
        const product = productManager.updateProduct({ id: req.params.productId, ...req.body })
        res.json({status: 'success', payload: product})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})

router.delete('/:productId', (req,res)=>{
    try {
        let message = productManager.deleteProduct(req.params.productId)
        res.json({status: 'success', payload: message})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }    
})

export {router};