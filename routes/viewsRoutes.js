import { Router } from "express";
import {ProductManager} from "../utils.js";

const FILENAME='products.json'
let productManager = new ProductManager(FILENAME)
let {success, error, products} = productManager.getProducts()

const router = Router()

router.get('/', (req,res) => {
    res.render('index',{layout: 'main',products})
})

router.get('/realtimeproducts', (req,res) => {
    res.render('realTimeProducts',{layout: 'main'})
})


export {router};