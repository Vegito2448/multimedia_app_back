const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config.db');

class Server{

  constructor(){
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      users: '/api/users',
    }

    //Conn DB
    this.DBConnect();

    //Middleware's
    this.middlewares();
    // App routes
    this.routes();
  }

  async DBConnect(){
    await dbConnection();
  }

  middlewares(){
    // CORS
    this.app.use(cors());

    // Parsing and reading body
    this.app.use(express.json());

    //Public directory
    this.app.use(express.static('public'));
  }

  routes(){
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.categories, require('../routes/categories.routes'));
    this.app.use(this.paths.products, require('../routes/products.routes'));
    this.app.use(this.paths.users, require('../routes/user.routes'));
  }

  listen(){
    this.app.listen(this.port, () =>
      console.log('Server running at port: ', this.port)
    )
  }

}
module.exports = Server;
