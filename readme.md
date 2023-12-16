## Coderhouse Backend Programming Course Project
This project is part of the [Backend Programming course](https://www.coderhouse.es/online/programacion-backend) offered by Coderhouse.

### Getting Started

1. **Clone the Repository**: Learn how to clone repositories from [GitHub documentation](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop).

2. **Prerequisites**: Ensure NodeJS (>=18.x) and NPM are installed on your machine. Check by running `node -v` and `npm -v` in your terminal.

3. **Install Dependencies**: Run `npm install` in your terminal to install required dependencies.

4. **Environment Setup**: Configure the .env file following the `sample.env` file's structure. Choose the appropriate environment (development, testing, or production).

5. **Start the Server**: Launch the server using `npm run start` and navigate to [http://localhost:8080/](http://localhost:8080/) in your browser.

## Dependencies

Below are the primary dependencies used in this project:

- **express**: Web framework for Node.js.
- **express-routemap**: Middleware for printing all registered routes in a tree structure.
- **express-handlebars**: Handlebars view engine for Express.
- **socket.io**: For real-time bidirectional event-based communication.
- **mongoose**: MongoDB object modeling tool.
- **mongoose-paginate-v2**: Mongoose plugin for query pagination.
- **dotenv**: Manages environment variables from .env files.
- **inspirational-quotes**: Provides random inspirational quotes.
- **connect-mongo**: MongoDB session store for Connect and Express.
- **bcrypt**: Password hashing library.
- **passport**: Comprehensive set of strategies support authentication for Node.js.
- **jsonwebtoken**: Implements JSON Web Tokens.
- **cookie-parser**: Parses cookies attached to the client request object.
- **uuid**: For RFC4122 UUID generation.
- **nodemailer**: Easy email sending in Node.js applications.
- **winston**: A versatile logging library.
- **colors**: Adds color support to Node.js console logs.
- **swagger-jsdoc** & **swagger-ui-express**: Integrates Swagger for API documentation.

## Development Dependencies

These are the development dependencies:

- **nodemon**: Monitors changes in the application and automatically restarts the server.
- **faker-js**: Generates fake data for testing and development.
- **mocha** & **chai** (with **chai-as-promised**): Provides a robust testing framework.
- **supertest**: Allows for HTTP assertions in testing.

## Known Issues

- JWT in Thunderclient: JWTs are not read from cookies. Use the front-end login and manually copy the JWT cookie to Postman for API testing.

- Chat Deletion: Deleting a chat (which should not happen naturally but a developer can force it) disrupts the Socket.IO functionality, as a new empty chat is not assigned to the user.

- Cart Functionality: Similar issue as with chat deletion, causing frontend errors.

- Hardcoded Admin User: A non-DB admin user set via environment variables lacks complete user properties, potentially leading to bugs.

- Filesystem Storage: The project predominantly uses MongoDB. An outdated filesystem implementation is present but incompatible with the current app version. It's retained for evaluation.

- Product Deletion in Premium User Accounts: Deleting a premium user also deletes their products, but these products remain in other users' carts, leading to potential errors.

- Downgrading Premium Users: Products from downgraded premium users are marked 'unavailable' but remain in other users' carts.

- Premium users can update stock and price with negative values, and stock with fractional values

## Desired features

- Consider blocking emails in testing and development environment

- A button for users to close their accounts

- Set a minimum age for login

- A button for users to change their personal data (first name, last name)

- A button for premium users to return to downgrade

- A button to disable the products (status: false)

- A sign for admins that a user has requested upgrade

