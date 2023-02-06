import ProductManager from "./productManagementUtils.js";
import express from 'express';

const App = express();
App.use(express.urlencoded({extended:true}))
const PORT = 8080

const FILENAME='products.json'
let productManager = new ProductManager(FILENAME)

// This function should probably be imported from a module but I am not sure if 
// it is intended to be the producManagementeUtils module, so I am not integrating it yet
function filterProducts (products,query) {
    if (!(query.minPrice === undefined)) {
        products = products.filter((item) => Number(item.price) >= Number(query.minPrice)  )
    }
    if (!(query.maxPrice === undefined)) {
        products = products.filter((item) => Number(item.price) <= Number(query.maxPrice)  )
    }
    if (!(query.minStock === undefined)) {
        products = products.filter((item) => Number(item.stock) >= Number(query.minStock)  )
    }
    if (!(query.maxStock === undefined)) {
        products = products.filter((item) => Number(item.stock) <= Number(query.maxStock)  )
    }
    if (!(query.limit === undefined)) {
        products = products.slice(0,Number(query.limit))
    }
    if (!(query.includesString === undefined)) {
        products = products.filter((item) => (item.title.includes(query.includesString) || item.description.includes(query.includesString)) )
    }
    return products
}


App.get('/', (req,res) => {
    res.send(
        `<h4> The expres server is alive</h4>
        <p> Go to /products route to browse products or to /products/ID if you know the ID of the product </p>`
    )
})

App.get('/products', (req,res) => {
    const { includesString, minPrice, maxPrice, minStock, maxStock, limit } = req.query;

    //In the future we will make an actual validation of the parameters
    let validatedQuery = { includesString, minPrice, maxPrice, minStock, maxStock, limit }

    let products = productManager.getProducts()
    let filteredProducts = filterProducts(products,validatedQuery)
    res.send(`<h4> Browse products</h4>
        <p> Browse product by quering properties in the URL. Example: "http://localhost:8080/products?minPrice=2&includesString=steel". Possible params are includesString (in title or description) minPrice, maxPrice, minStock, maxStock and limit </p>
        ${JSON.stringify(filteredProducts)} 
        `
    )
})

App.get('/products/:productId', (req,res) => {
    const { productId } = req.params;
    let products = productManager.getProducts()
    let validId = products.some((item) => Number(item.id) === Number(productId) )

    let content = validId?
                JSON.stringify( products.find((item) => Number(item.id) === Number(productId) ) )
                :`<p style="color:red;"> Error: the product with ID ${productId} does not exist</p>`

    res.send(`<h4> Browse products</h4>
    <p> Browse product by quering properties in the URL. Example: "/products?minPrice=100&includesString=notebook". Possible params are includesString (in title or description) minPrice, maxPrice, minStock, maxStock and limit </p>
    ${content} `)
})

App.listen(PORT, () => {
    console.log(`App listening to port ${PORT}. Go to http://localhost:3000. Note HTTPS is not supported, only HTTP.`)
})
