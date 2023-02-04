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
    constructor() {
        this.products = [];
    }

    addProduct (productObject) {
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

    }
    getProducts() {
        console.log(this.products)
        // Alternative: log each product
        // this.products.forEach((product,index) => console.log(product));
    }

    getProductById(queryId) {
        let product = this.products.find( product => product.id === queryId)
        if (product) {
            console.log(product)
        } else {
            console.error('Error: Not found')
        }
    }
}

module.exports = {Product, ProductManager}