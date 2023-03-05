import { Router } from "express";
import {__dirname} from '../path_utils.js';
import { productManager } from "../app.js";

const router = Router()

router.get('/', (req,res) => {
    try {
        let products = productManager.getProducts()
        res.render('index',{layout: 'main',products})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})

router.get('/realtimeproducts', (req,res) => {
    try {
        let products = productManager.getProducts()
        res.render('realTimeProducts',{layout: 'main'})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


export {router};