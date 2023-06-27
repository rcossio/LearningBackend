import ProductManager from '../src/ProductManager.js';
import fs from 'fs';

// Delete the file if it exists so the test is clean
try {
  fs.unlinkSync('./test/productManager.json');
} catch (error) {
  console.error(error);
}

// Instantiate the ProductManager class
const productManager = new ProductManager('./test/productManager.json');

// Call getProducts (should return an empty array)
console.log(productManager.getProducts());

// Call addProduct with the given fields
productManager.addProduct({
	title: 'producto prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnails: [],
	code: 'abc123',
	stock: 25,
});

// Call getProducts again, the added product should be displayed
console.log(productManager.getProducts());

// Call addProduct with the same fields, should raise an error due to duplicate product code
try {
  productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnails: [],
    code: 'abc123',
    stock: 25,
  });
} catch (error) {
  console.error(error);
}

// Evaluate the getProductById method with an existing ID
try {
  const product = productManager.getProductById(1);
  console.log(product);
} catch (error) {
  console.error(error);
}

// Evaluate the getProductById method with a non-existing ID
try {
  const product = productManager.getProductById(100);
  console.log(product);
} catch (error) {
  console.error(error);
}

// Calls the method updateProduct and changes the product, and then displays it
productManager.updateProduct(1, {
  title: 'titulo cambiado',
  description: 'Descripción cambiada',
  price: 999,
  thumbnails: [],
  code: 'cba321',
  stock: 10,
});
console.log(productManager.getProducts());

// Evaluate the deleteProduct with a valid product ID
try {
  productManager.deleteProduct(1);
} catch (error) {
  console.error(error);
}

// Evaluate the deleteProduct with an invalid product ID
try {
  productManager.deleteProduct(100);
} catch (error) {
  console.error(error);
}

//Finally, add some products to check the file persistence
console.log('------- Starting to add files -----------------')
productManager.addProduct(
  {
    title: 'Product A',
    description: 'This is the description for Product 1.',
    price: 19.99,
    thumbnails: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    code: 'ABC123',
    stock: 50
  })
productManager.addProduct(
  {
    title: 'Product B',
    description: 'This is the description for Product 2.',
    price: 9.99,
    thumbnails: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
    code: 'DEF456',
    stock: 20
  })
productManager.addProduct(
  {
    title: 'Product C',
    description: 'This is the description for Product 3.',
    price: 49.99,
    thumbnails: ['image7.jpg', 'image8.jpg', 'image9.jpg'],
    code: 'GHI789',
    stock: 5
  })
productManager.addProduct(
  {
    title: 'Product D',
    description: 'This is the description for Product 4.',
    price: 29.99,
    thumbnails: ['image10.jpg', 'image11.jpg', 'image12.jpg'],
    code: 'JKL012',
    stock: 30
  })
productManager.addProduct(
  {
    title: 'Product E',
    description: 'This is the description for Product 5.',
    price: 14.99,
    thumbnails: ['image13.jpg', 'image14.jpg', 'image15.jpg'],
    code: 'MNO345',
    stock: 15
  })
productManager.addProduct(
  {
    title: 'Product F',
    description: 'This is the description for Product 6.',
    price: 39.99,
    thumbnails: ['image16.jpg', 'image17.jpg', 'image18.jpg'],
    code: 'PQR678',
    stock: 8
  })
productManager.addProduct(
  {
    title: 'Product G',
    description: 'This is the description for Product 7.',
    price: 24.99,
    thumbnails: ['image19.jpg', 'image20.jpg', 'image21.jpg'],
    code: 'STU901',
    stock: 25
  })
productManager.addProduct(
  {
    title: 'Product H',
    description: 'This is the description for Product 8.',
    price: 34.99,
    thumbnails: ['image22.jpg', 'image23.jpg', 'image24.jpg'],
    code: 'VWX234',
    stock: 12
  })
productManager.addProduct(
  {
    title: 'Product I',
    description: 'This is the description for Product 9.',
    price: 59.99,
    thumbnails: ['image25.jpg', 'image26.jpg', 'image27.jpg'],
    code: 'YZA567',
    stock: 3
  })
productManager.addProduct(
  {
    title: 'Product J',
    description: 'This is the description for Product 10.',
    price: 49.99,
    thumbnails: ['image28.jpg', 'image29.jpg', 'image30.jpg'],
    code: 'BCD890',
    stock: 18
  })
console.log('------- End of adding files -------------------')