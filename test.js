import ProductManager from "./productManagementUtils.js";
import * as fs from 'fs';

console.log('\n *** TEST ***')

const FILENAME='products.json'
fs.existsSync(FILENAME) && fs.unlinkSync(FILENAME)

console.log('\n-- Creating an empty ProductManager. Should raise error')
let productManagerInstanceTest = new ProductManager()

console.log('\n-- Creating a ProductManager with the rightpath')
let productManagerInstance = new ProductManager(FILENAME)

console.log('\n-- Testing getProducts(). Should give []')
productManagerInstance.getProducts()

console.log('\n-- Testing addProducts()')
productManagerInstance.addProduct({
    title:      'First product', 
    description:'Description of the product', 
    price:      '200',
    thumbnail:  'No image',
    code:       'ABC123',
    stock:      '10'})    
  
console.log('\n-- Testing getProducts(). Should give one product')
productManagerInstance.getProducts()

console.log('\n-- Testing addProducts() with repeated product. Should give error')
productManagerInstance.addProduct({
    title:      'First product', 
    description:'Description of the product', 
    price:      '200',
    thumbnail:  'No image',
    code:       'ABC123',
    stock:      '10'}) 

console.log('\n-- Testing addProducts() with new valid product. Should give two products')
productManagerInstance.addProduct({
    title:      'Second product', 
    description:'Description of the product', 
    price:      '150',
    thumbnail:  'No image',
    code:       'KHL875',
    stock:      '30'}) 
productManagerInstance.getProducts()

console.log('\n-- Testing getProductById() with valid Id. Should give product')
productManagerInstance.getProductById(1)

console.log('\n-- Testing getProductById() with invalid Id. Should give error')
productManagerInstance.getProductById(5)

console.log('\n-- Testing deleteProduct(). Should give one product')
productManagerInstance.deleteProduct(1)
productManagerInstance.getProducts()

console.log('\n-- Testing deleteProduct() with invalid id. Should give error')
productManagerInstance.deleteProduct(27)

console.log('\n-- Testing updateProduct() with invalid id. Should give error')
productManagerInstance.updateProduct(27,{
    title:      'Second product', 
    description:'Description of the product', 
    price:      '150',
    thumbnail:  'No image',
    code:       'KHL875',
    stock:      '30'})

console.log('\n-- Testing updateProduct(). Should show changes')
productManagerInstance.updateProduct(2,{
    title:      'Second product', 
    description:'Description has been chaged', 
    price:      '15000',
    thumbnail:  'Still no image...',
    code:       'KHL875',
    stock:      '3000'})
productManagerInstance.getProducts()

console.log('\n-- Opening the ProductManager with another instantiation. Should give one product')
let productManagerInstance2 = new ProductManager(FILENAME)
productManagerInstance2.getProducts()

console.log('\n *** TEST END***')
