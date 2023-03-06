import { Router } from "express";
import {__dirname} from '../path_utils.js';
import productModel from "../model/products.model.js";

const router = Router()

router.get('/', async (req,res) => {
    try {
        const products = await productModel.find().lean()
        res.render('index',{layout: 'main',products})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})

router.get('/realtimeproducts', async (req,res) => {
    try {
        const products = await productModel.find().lean()
        res.render('realTimeProducts',{layout: 'main'})
    } catch (error) {
        res.json({status: 'error', payload: error})
    }
})


export {router};