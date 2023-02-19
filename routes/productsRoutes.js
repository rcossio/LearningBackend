import { ProductManager } from "../utils.js";
import { Router } from "express";

const router = Router()

const FILENAME='products.json';
let productManager = new ProductManager(FILENAME);

// This function should probably be imported from a module but I am not sure if 
// it is intended to be the producManagemente module, so I am not integrating it yet
function filterProducts (products,{ includesString, minPrice, maxPrice, minStock, maxStock, limit }) {
    if (!isNaN(minPrice)) {
        products = products.filter((item) => item.price >= minPrice  )
    }
    if (!isNaN(maxPrice)) {
        products = products.filter((item) => item.price <= maxPrice  )
    }
    if (!isNaN(minStock)) {
        products = products.filter((item) => item.stock >= minStock  )
    }
    if (!isNaN(maxStock)) {
        products = products.filter((item) => item.stock <= maxStock  )
    }
    if (!isNaN(limit)) {
        products = products.slice(0,limit)
    }
    if (includesString !== null) {
        products = products.filter((item) => (item.title.includes(includesString) || item.description.includes(includesString)) )
    }
    return products
}

function typifyFilterParams ({ includesString, minPrice, maxPrice, minStock, maxStock, limit }) {
    
    includesString = (typeof includesString === 'undefined')
                    ? null
                    : String(includesString)

    minPrice        = Number(minPrice)
    maxPrice        = Number(maxPrice)
    minStock        = parseInt(minStock)
    maxStock        = parseInt(maxStock)
    limit           = parseInt(limit)

    return { includesString, minPrice, maxPrice, minStock, maxStock, limit }
}

router.get('/', (req,res) => {
    let filterParams = req.query
    filterParams = typifyFilterParams(filterParams)
    let { success, error, products } = productManager.getProducts()
    let filteredProducts = filterProducts(products,filterParams)

    res.json({
            success,
            request: filterParams,
            error,
            data: filteredProducts
        }) 
})


router.get('/:productId', (req,res) => {

    let productId = req.params.productId;
    const { success, error, product } = productManager.getProductById(productId)

    res.json({
        success,
        request: {productId},
        error,
        data: product
    }) 
})


router.post('/', (req,res) => {
    const { title, description, price, thumbnail, code, stock, category, status} = req.body

    let { success, error, product } = productManager.addProduct({ title, description, price, thumbnail, code, stock, category, status })   
    res.json({
        success,
        request: { title, description, price, thumbnail, code, stock, category, status },
        error,
        data: product
    }) 
})

router.put('/:productId', (req,res)=>{
    let id = req.params.productId;
    const { title, description, price, thumbnail, code, stock, category, status } = req.body

    let { success, error, product } = productManager.updateProduct({ id, title, description, price, thumbnail, code, stock, category, status })

    res.json({
        success,
        request: { id, title, description, price, thumbnail, code, stock, category, status },
        error,
        data: product
    }) 

})

router.delete('/:productId', (req,res)=>{
    let id = req.params.productId;

    let { success, error } = productManager.deleteProduct(id)

    res.json({
        success,
        request: {id},
        error,
        data: null,
    }) 
    
})

export {router};