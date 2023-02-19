import * as fs from 'fs';


class Product {
    constructor({id,title, description, price, thumbnail, code, stock, category,status}) {
        this.id  = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status;
    }
}

class CartManager {
    constructor(file_path) {
        if (file_path !== undefined) {
            this.path = file_path;
            if ( fs.existsSync(this.path) ) {
                this.loadCartManager()
                console.log('Loading Cart Manager from pre-existing file')
            } else{
                this.carts = []
                console.log('Creating a new file for Cart Manager')
            }
                            
            this.saveCartManager()
        } else {
            console.error('Error: Product manager will not work without a path')
        }
    }

    saveCartManager(){
        try {
            fs.writeFileSync(this.path,JSON.stringify(this.carts))
        } catch (error){
            console.error(error)
        }
        
    }

    loadCartManager(){
        try {
            let cartManagerJson = fs.readFileSync(this.path,'utf-8')
            this.carts = JSON.parse(cartManagerJson); 

        } catch (error) {
            console.error(error)
        }
    }

    addCart ({productsArray}) {
        if (!( Array.isArray(productsArray) )) {
            return {success: false, error: 'invalid productsArray', product:null}
        }

        this.loadCartManager()

        let id = this.carts.length === 0? 
                    1: 
                    this.carts.slice(-1)[0].id + 1

        let cart = {id,productsArray}
        this.carts.push(cart)
        this.saveCartManager()
        return {success: true, error: null, cart}
    }

    getCarts() {
        this.loadCartManager()
        return {success: true, error: null, carts: this.carts}
    }

    getCartById(queryId) {

        let id = parseInt(queryId)

        if ( isNaN(id) || id.toString() !== String(queryId) ) {
            return {success: false, error: 'invalid id type', cart:null}
        }

        this.loadCartManager()
        let cart = this.carts.find( cart => cart.id === id)
        if (cart) {
            return {success: true, error: null, cart}
        } else {
            return {success: false, error: 'cart not found', cart:null}
        }
    }

    addProductToCartByIds(cartQueryId,productQueryId){

        let cartId = parseInt(cartQueryId)
        if ( isNaN(cartId) || cartId.toString() !== String(cartQueryId) ) {
            return {success: false, error: 'invalid cart id type'}
        }

        let productId = parseInt(productQueryId)
        if ( isNaN(productId) || productId.toString() !== String(productQueryId) ) {
            return {success: false, error: 'invalid product id type'}
        }

        this.loadCartManager()
        let cartIndex = this.carts.findIndex( cart => cart.id === cartId)

        if (cartIndex != -1) {
            let cart = this.carts[cartIndex]
            let newProductsArray = cart.productsArray.map ( ({product,quantity}) => {
                if (product === productId) {
                    quantity++
                }
                return {product, quantity}

            } )
            let newCart = {id:cartId, productsArray:newProductsArray}
            this.carts[cartIndex] = newCart
            this.saveCartManager()
            return {success: true, error: null, cart:newCart}

        } else {
            return {success: true, error: 'non-existent id', cart:null}
        }

    }

}

class ProductManager {
    constructor(file_path) {
        if (file_path !== undefined) {
            this.path = file_path;
            if ( fs.existsSync(this.path) ) {
                this.loadProductManager()
                console.log('Loading Product Manager from pre-existing file')
            } else{
                this.products = []
                console.log('Creating a new file for Product Manager')
            }
                            
            this.saveProductManager()
        } else {
            console.error('Error: Product manager will not work without a path')
        }
    }

    saveProductManager(){
        try {
            fs.writeFileSync(this.path,JSON.stringify(this.products))
        } catch (error){
            console.error(error)
        }
        
    }

    loadProductManager(){
        try {
            let productManagerJson = fs.readFileSync(this.path,'utf-8')
            this.products = JSON.parse(productManagerJson); 

        } catch (error) {
            console.error(error)
        }
    }

    addProduct ({title, description, price, thumbnail, code, stock, category,status}) {
        
        title       = String(title)
        description = String(description)
        price       = Number(price)
        code        = String(code)
        stock       = parseInt(stock)
        category    = String(category)

        if (typeof status === 'string' && status.toLowerCase() === 'true') {
            status = true
        } else if (typeof status !== 'boolean') {
            status = false
        }

        if (!( Array.isArray(thumbnail) )) {
            return {success: false, error: 'invalid thumbnail', product:null}
        }

        this.loadProductManager()
        if (this.products.some( product => product.code === code)){
            return {success: false, error: 'duplicated code', product:null}
        }

        let id = this.products.length === 0? 
                    1: 
                    this.products.slice(-1)[0].id + 1

        let product = new Product({id, title, description, price, thumbnail, code, stock, category,status})
        this.products.push(product)
        this.saveProductManager()

        return {success: true, error: null, product}
    }

    getProducts() {
        this.loadProductManager()
        return {success: true, error: null, products: this.products}
    }

    getProductById(queryId) {

        let id = parseInt(queryId)

        if ( isNaN(id) || id.toString() !== String(queryId) ) {
            return {success: false, error: 'invalid id type', product:null}
        }

        this.loadProductManager()
        let product = this.products.find( product => product.id === id)
        if (product) {
            return {success: true, error: null, product}
        } else {
            return {success: false, error: 'product not found', product:null}
        }
    }

    deleteProduct(queryId) {

        let id = parseInt(queryId)
        if ( isNaN(id) || id.toString() !== String(queryId) ) {
            return {success: false, error: 'invalid id type', product:null}
        }

        this.loadProductManager()
        if ( this.products.some( product => product.id === id) ) {
            this.products = this.products.filter( product => product.id != id)
            this.saveProductManager()
            return {success: true, error: null}
        } else {
            return {success: false, error: 'non-existent id'}
        }

    }

    updateProduct({ id:queryId, title, description, price, thumbnail, code, stock, category,status }){

        let id = parseInt(queryId)
        if ( isNaN(id) || id.toString() !== String(queryId) ) {
            return {success: false, error: 'invalid id type', product:null}
        }

        title       = String(title)
        description = String(description)
        price       = Number(price)
        code        = String(code)
        stock       = parseInt(stock)
        category    = String(category)

        if (typeof status === 'string' && status.toLowerCase() === 'true') {
            status = true
        } else if (typeof status !== 'boolean') {
            status = false
        }

        if (!( Array.isArray(thumbnail) )) {
            return {success: false, error: 'invalid thumbnail', product:null}
        }

        this.loadProductManager()
        let productIndex = this.products.findIndex( product => product.id === id)

        if (productIndex != -1) {
            let newProduct = new Product({id, title, description, price, thumbnail, code, stock, category, status })
            this.products[productIndex] = newProduct
            this.saveProductManager()
            return {success: true, error: null, product:newProduct}

        } else {
            return {success: true, error: 'non-existent id', product:null}
        }
    }

}

export {ProductManager,CartManager};