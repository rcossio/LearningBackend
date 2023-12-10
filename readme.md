## This is the a project from Coderhouse [Backend Programming course ](http://https://www.coderhouse.es/online/programacion-backend "link")

### Instructions

1. Clone the repository (to learn how check [this link](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop))

2. Be sure to have NodeJS (>=18.x) and NPM installed. Test this with the commands `node -v` or `npm -v` in a terminal.

3. Install the dependencies with `npm install`.

4. For testing, start the server with `npm run start` and go to [http://localhost:8080/](http://localhost:8080/)

## Dependencies

The ones marked are the ones currently used

- [x]  **express** : web framework.
- [x]  **express-routemap** : express middleware to print all registered routes in a tree structure.
- [x]  **express-handlebars** : handlebars view engine for express.
- [x]  **socket.io** : enables real-time bidirectional event-based communication.
- [x]  **mongoose** : MongoDB object modeling tool.
- [x]  **mongoose-paginate-v2** : mongoose plugin to paginate mongoose queries.
- [x]  **dotenv** : loads environment variables from a .env file.
- [x]  **inspirational-quotes** : get inspirational quotes.
- [x]  **connect-mongo** : MongoDB session store for Connect and Express.
- [x]  **bcrypt** : library to help you hash passwords.
- [x]  **passport** : authentication middleware for Node.js.
- [x]  **passport-local** : passport strategy for authenticating with a username and password.
- [x]  **passport-github2** : passport strategy for authenticating with GitHub using the OAuth 2.0 API.
- [x]  **passport-google-oauth20** : passport strategy for authenticating with Google using the OAuth 2.0 API.
- [x]  **passport-jwt** : passport strategy for authenticating with a JSON Web Token.
- [x]  **express-jwt** : middleware that validates JsonWebTokens and sets req.auth.
- [x]  **jsonwebtoken** : implementation of JSON Web Tokens.
- [x]  **cookie-parser** : cookie parsing middleware.
- [x]  **uuid** : simple, fast generation of RFC4122 UUIDS.
- [x]  **nodemailer** : module for Node.js applications to allow easy as cake email sending.
- [x]  **winston** : logger for just about everything.
- [x]  **colors** : get colors in your node.js console.
- [x]  **swagger-jsdoc** : allows you to integrate swagger using JSDoc comments in your code.
- [x]  **swagger-ui-express** : serves auto-generated swagger-ui generated API docs from express.

## Dev Dependencies

The ones marked are the ones currently used

- [x]  **nodemon** : tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [x]  **faker-js** : generate massive amounts of fake data in the browser and node.js.
- [x]  **mocha**: for testing
- [x]  **chai**: for easier syntex while testing
- [x]  **chai-as-promised**: for easier syntax while testing with promises
- [x]  **supertest**: for testing requests in the app


## Known issues

- When working with thunderclient te JWT is not read from the cookie. Login in the front end and use Postman instead (copy the jwt cookie manually).

- Chat: When a chat is deleted, the user is not asign a new empty chat, it just crashes the socketIO functionality.

- Cart: The same as with chat but at least there is a sign of the error in the frontend

- There is an admin email requested from Coderhouse that is not in the DB, some times the app crashes while using it