import { CartManager } from "../utils.js";
import { Router } from "express";

const router = Router()

const CARTFILENAME='carts.json';
let cartManager = new CartManager(CARTFILENAME);

router.get('/', (req,res) => {

    const {success, error, carts} = cartManager.getCarts()
    res.json({
        success,
        request: null,
        error,
        data: carts
    }) 
})

router.post('/', (req,res) => {
    const {productsArray} = req.body
    let {success, error, cart} = cartManager.addCart({productsArray}) 

    res.json({
        success,
        request: {productsArray},
        error,
        data: cart
    }) 
})

router.get('/:cartId', (req,res) => {

    let cartId = req.params.cartId;
    const { success, error, cart } = cartManager.getCartById(cartId)

    res.json({
        success,
        request: {cartId},
        error,
        data: cart
    }) 
})

router.post('/:cartId/product/:productId', (req,res) => {

    let cartId = req.params.cartId;
    let productId = req.params.productId;

    const { success, error, cart } = cartManager.addProductToCartByIds(cartId,productId)

    res.json({
        success,
        request: {cartId,productId},
        error,
        data: cart
    }) 
})

export {router};