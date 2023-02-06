import * as fs from 'fs';

class Product {
    constructor({id,title, description, price, thumbnail, code, stock}) {
        this.id  = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
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

    addProduct (productObject) {
        this.loadProductManager()
        let acceptProduct = this.products.length === 0? 
                            true : 
                            !this.products.some( product => product.code === productObject.code);

        if (acceptProduct) {
            let id = this.products.length === 0? 
                    1: 
                    this.products.slice(-1)[0].id + 1
            let product = new Product({id, ...productObject})
            this.products.push(product)
            console.log(`Your product was added with id: ${id}`)

        } else {
            console.error('Error: Product code is duplicated! (the product will not be added)')
        }

        this.saveProductManager()

    }
    getProducts() {
        this.loadProductManager()
        console.log(this.products)
        return this.products
    }

    getProductById(queryId) {
        this.loadProductManager()
        let product = this.products.find( product => product.id === queryId)
        if (product) {
            console.log(product)
            return product
        } else {
            console.error('Error: Not found')
        }
    }

    deleteProduct(queryId) {
        this.loadProductManager()
        if ( this.products.some( product => product.id === queryId) ) {
            this.products = this.products.filter( product => product.id != queryId)
            console.log(`Product with id ${queryId} was removed`)
        } else {
            console.error(`Error: there is no product with id ${queryId}`)
        }
        this.saveProductManager()
    }

    updateProduct(queryId,productObject){
        this.loadProductManager()

        let productIndex = this.products.findIndex( product => product.id === queryId)
        if (productIndex != -1) {
            this.products[productIndex] = new Product({id:queryId, ...productObject})
            this.saveProductManager()
            console.log(`Updated product with id ${queryId}`)

        } else {
            console.error(`Error: Product with id ${queryId} was not found`)
        }
    }

}

export default ProductManager