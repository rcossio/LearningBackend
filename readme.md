## This is the a project from Coderhouse [Backend Programming course ](http://https://www.coderhouse.es/online/programacion-backend "link")

### Description
This package has a module to manage products. It can store a list of products in a file and handle it (adding/deleting/modifying products). Also, it mounts a local server to access to the products via [http://localhost:8080](http://localhost:8080).

### Instructions

1. Clone the repository (to learn how cheeck [this link](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop))

2. Be sure to have NodeJS and NPM installed. Test this with the commands
	`node -v`
	`npm -v`
in a terminal.

3. Install the (only) dependency:
`npm install express`
or
`npm install`.

4. Test the code with:
`node test.js`
or
`npm run test`.
This script also loads 10 products inspired by [IKEA](https://www.ikea.com/ie/en/cat/kitchen-utensils-kt002/)

5. Enable the server with
`node app.js`

6. Go to [http://localhost:8080/products](http://localhost:8080/products) and make a query. Example: [http://localhost:8080/products?maxPrice=10&minStock=20](http://localhost:8080/products?maxPrice=10&minStock=20)

7. Go to [http://localhost:8080/products/2](http://localhost:8080/products/2) to see product with ID 2. Or choose other IDs


### Known issues

The validity of query params while searching for products is not being validated. Therefore, strange behaviour is expected when params are not used correctly, such as http://localhost:8080/products?limit=-1.
