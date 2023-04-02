// This route is not very important
// I just leave it to have a custom middleware implemented

import { Router } from "express";

const router = Router()

let welcomeHTML = `<h4> The API is alive</h4>
                <p> Go to api/products route to browse products or to api/products/ID if you know the ID of the product </p>` 

function mid1(req,res,next){
    console.log('Somebody visited the API at time:', Date.now())
    next()
}

router.get('/', mid1, (req,res) => { 
    return res.send(welcomeHTML) 
})

export {router};