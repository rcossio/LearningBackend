## This is the a project from Coderhouse [Backend Programming course ](http://https://www.coderhouse.es/online/programacion-backend "link")

### Description
This package has a module to manage products. It can store a list of products in a file and handle it (adding/deleting/modifying products). Also, it mounts a local server to access to the products via [http://localhost:8080](http://localhost:8080) with routes available to use API methods to manage the products.

### Instructions

1. Clone the repository (to learn how cheeck [this link](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop))

2. Be sure to have NodeJS and NPM installed. Test this with the commands
	`node -v`
	`npm -v`
in a terminal.

3. Install the dependencies:

`npm install express`

`npm install cookie-parser`

`npm install multer`

`npm install express-handlebars`

`npm install socket.io`

or simply

`npm install`.

4. For testing, first load some products withLoad Test the code with:

`node loadProducts.js`

or

`npm run loadProducts`.

This script also loads 10 products inspired by [IKEA](https://www.ikea.com/ie/en/cat/kitchen-utensils-kt002/)


5. Enable the server with
`node app.js`


6. Go to [http://localhost:8080/products](http://localhost:8080/products) and make a query. Example: [http://localhost:8080/products?maxPrice=10&minStock=20](http://localhost:8080/products?maxPrice=10&minStock=20)

7. Go to [http://localhost:8080/products/2](http://localhost:8080/products/2) to see product with ID 2. Or choose other IDs

8. Regarding the management of the products: You can use GET methods in /products, /products/:productId. POST method in /products. PUT and DELETE method in  /products/:productId/

9. You can go to http://localhost:8080/realproducts to enable socket.io connection. In parallel you can use postman to erase o create a new product. To update click on the Update button provided. Note that even if the connection is instantaneous, the app does not update the products loaded in memory. The update button forces the app to re-read the product files. This is not the ideal behaviour for the app, it must be improved.

### Known issues

The validity of query params while searching for products is not being validated. Therefore, strange behaviour is expected when params are not used correctly, such as http://localhost:8080/products?limit=-1.

Products have validation type (string, integer, number, etc), but there is no validation on their values. You could have a product with stock = -27 since it is an integer number, even if it isn't realistic.

The validity of productId is not cheked when adding it to the cart.

### Tasklist

- Use multer to upload many thumbnail files