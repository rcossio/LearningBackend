import ProductManager from '../src/ProductManager.js';

// Instantiate the ProductManager class
const productManager = new ProductManager();

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
