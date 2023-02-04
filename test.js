utils = require("./productManagementUtils")
ProductManager = utils.ProductManager


console.log('\n *** TEST ***')

console.log('\n Creating ProductManager')
let productManagerInstance = new ProductManager()

console.log('\n Testing getProducts(). Should give []')
productManagerInstance.getProducts()

console.log('\n Testing addProducts()')
productManagerInstance.addProduct({
    title:      'First product', 
    description:'Description of the product', 
    price:      '200',
    thumbnail:  'No image',
    code:       'ABC123',
    stock:      '10'})    
  

console.log('\n Testing getProducts(). Should give one product')
productManagerInstance.getProducts()

console.log('\n Testing addProducts() with repeated product. Should give error')
productManagerInstance.addProduct({
    title:      'First product', 
    description:'Description of the product', 
    price:      '200',
    thumbnail:  'No image',
    code:       'ABC123',
    stock:      '10'}) 

console.log('\n Testing addProducts() with new valid product')
productManagerInstance.addProduct({
    title:      'Second product', 
    description:'Description of the product', 
    price:      '150',
    thumbnail:  'No image',
    code:       'KHL875',
    stock:      '30'}) 

console.log('\n Testing getProducts(). Should give two products')
productManagerInstance.getProducts()

console.log('\n Testing getProductById() with valid Id. Should give product')
productManagerInstance.getProductById(1)

console.log('\n Testing getProductById() with invalid Id. Should give error')
productManagerInstance.getProductById(5)

console.log('\n *** TEST END***')
