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
                            this.products.find( product => product.code === productObject.code)?
                                false :
                                true;

        if (acceptProduct) {
            let id = this.products.length === 0? 1: this.products.slice(-1).id + 1
            console.error(`Your product was added with id: ${id}`)
            let product = new Product({id, ...productObject})
            this.products.push(product)

        } else {
            console.error('Product code is duplicated! (the product will not be added)')
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
            console.error('Not found')
        }
    }
}

//Test
console.log('\n Creating ProductManager')
let productManagerInstance = new ProductManager()

console.log('\n Testing getProducts(). Should give []')
productManagerInstance.getProducts()

console.log('\n Testing addProducts()')
productManagerInstance.addProduct({
    title:      'producto prueba', 
    description:'Este es un producto prueba', 
    price:      '200',
    thumbnail:  'Sin imagen',
    code:       'abc123',
    stock:      '25'})    

console.log('\n Testing getProducts(). Should give one product')
productManagerInstance.getProducts()

console.log('\n Testing addProducts() with repeated product. Should give error')
productManagerInstance.addProduct({
    title:      'producto prueba', 
    description:'Este es un producto prueba', 
    price:      '200',
    thumbnail:  'Sin imagen',
    code:       'abc123',
    stock:      '25'}) 

console.log('\n Testing getProductById() with valid Id. Should give product')
productManagerInstance.getProductById(1)

console.log('\n Testing getProductById() with invalid Id. Should give error')
productManagerInstance.getProductById(5)