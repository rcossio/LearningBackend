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

console.log('\n-- Finally, adding some products to work with the expressJS server (not actually testing that)')
productManagerInstance2.addProduct({
    title:      'HEAT', 
    description:'Pot stand, cork, 19 cm', 
    price:      '3',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/heat-pot-stand-cork__0712344_pe728747_s5.jpg',
    code:       '870.777.00',
    stock:      '50'}) 

productManagerInstance2.addProduct({
    title:      'UPPFYLLD', 
    description:'Fruit cutter, set of 4, mixed colours', 
    price:      '6',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/uppfylld-fruit-cutter-set-of-4-mixed-colours__1121845_pe874377_s5.jpg',
    code:       '205.293.97',
    stock:      '90'})     

productManagerInstance2.addProduct({
    title:      'IDEALISK', 
    description:'Colander, stainless steel/black, 34x23 cm', 
    price:      '9',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/idealisk-colander-stainless-steel-black__0713133_pe729277_s5.jpg',
    code:       '501.037.55',
    stock:      '20'}) 

productManagerInstance2.addProduct({
    title:      'GUBBRORA', 
    description:'Rubber spatula, green/pink/blue/white', 
    price:      '1',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/gubbroera-rubber-spatula-green-pink-blue-white__0711753_pe728442_s5.jpg',
    code:       '902.257.31',
    stock:      '100'})     

productManagerInstance2.addProduct({
    title:      'GULLPIGG', 
    description:'Measuring jug, tempered glass, 58 cl', 
    price:      '6',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/gullpigg-measuring-jug-tempered-glass__1016529_pe830462_s5.jpg',
    code:       '705.036.15',
    stock:      '80'}) 

productManagerInstance2.addProduct({
    title:      'GRUNKA', 
    description:'4-piece kitchen utensil set, stainless steel', 
    price:      '8',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/grunka-4-piece-kitchen-utensil-set-stainless-steel__0711741_pe728430_s5.jpg',
    code:       '300.833.34',
    stock:      '50'})     

productManagerInstance2.addProduct({
    title:      'BLANDA BLANK', 
    description:'Serving bowl, stainless steel, 20 cm', 
    price:      '4',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/blanda-blank-serving-bowl-stainless-steel__0712888_pe729126_s5.jpg',
    code:       '200.572.55',
    stock:      '130'}) 

productManagerInstance2.addProduct({
    title:      'KLOCKREN', 
    description:'Colander, 5.0 l', 
    price:      '12',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/klockren-colander__0791144_pe764530_s5.jpg',
    code:       '504.491.77',
    stock:      '110'})     

productManagerInstance2.addProduct({
    title:      'PRICKIG', 
    description:'Microwave lid, grey, 26 cm', 
    price:      '1.5',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/prickig-microwave-lid-grey__0710828_pe727792_s5.jpg',
    code:       '701.860.90',
    stock:      '10'}) 

productManagerInstance2.addProduct({
    title:      'SMAKSAM', 
    description:'Cake decoration set', 
    price:      '7',
    thumbnail:  'https://www.ikea.com/ie/en/images/products/smaksam-cake-decoration-set__0712273_pe728720_s5.jpg',
    code:       '102.570.33',
    stock:      ''})     


console.log('\n *** TEST END***')
