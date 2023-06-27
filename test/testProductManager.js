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