import { ProductManager } from "../utils.js";
import { Router } from "express";

const router = Router()

const FILENAME='products.json';
let productManager = new ProductManager(FILENAME);

// This function should probably be imported from a module but I am not sure if 
// it is intended to be the producManagemente module, so I am not integrating it yet
function typifyFilterParams ({ includesString, minPrice, maxPrice, minStock, maxStock, limit }) {
    
    includesString  = (typeof includesString === 'undefined') ? null: String(includesString)
    minPrice        = Number(minPrice)
    maxPrice        = Number(maxPrice)
    minStock        = parseInt(minStock)
    maxStock        = parseInt(maxStock)
    limit           = parseInt(limit)

    return { includesString, minPrice, maxPrice, minStock, maxStock, limit }
}

function filterProducts (products,{ includesString, minPrice, maxPrice, minStock, maxStock, limit }) {

    if (!isNaN(minPrice)) {
        products = products.filter((item) => item.price >= minPrice  ) }
    if (!isNaN(maxPrice)) {
        products = products.filter((item) => item.price <= maxPrice  ) }
    if (!isNaN(minStock)) {
        products = products.filter((item) => item.stock >= minStock  ) }
    if (!isNaN(maxStock)) {
        products = products.filter((item) => item.stock <= maxStock  ) }
    if (!isNaN(limit)) {
        products = products.slice(0,limit) }
    if (includesString !== null) {
        products = products.filter((item) => (item.title.includes(includesString) || item.description.includes(includesString)) )  }

    return products
}


router.get('/', (req,res) => {
    let filterParams = typifyFilterParams(req.query)
    const { success, error, products } = productManager.getProducts()
    let filteredProducts = filterProducts(products,filterParams)

    res.json({success,
            request: filterParams,
            error,
            data: filteredProducts
        }) 
})


router.get('/:productId', (req,res) => {
    const { success, error, product } = productManager.getProductById(req.params.productId)

    res.json({success,
            request: {id: req.params.productId},
            error,
            data: product
    }) 
})


router.post('/', (req,res) => {
    const { success, error, product } = productManager.addProduct(req.body)   

    res.json({success,
            request: { ...req.body },
            error,
            data: product
    }) 
})

router.put('/:productId', (req,res)=>{
    const { success, error, product } = productManager.updateProduct({ id: req.params.productId, ...req.body })

    res.json({ success,
            request: { id: req.params.productId, ...req.body },
            error,
            data: product
    }) 

})

router.delete('/:productId', (req,res)=>{
    let { success, error } = productManager.deleteProduct(req.params.productId)

    res.json({ success,
            request: {id: req.params.productId},
            error,
            data: null,
    }) 
    
})

export {router};