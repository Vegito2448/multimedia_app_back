const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config.db');

class Server{

  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    this.authPath = '/api/auth';

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
    this.app.use(this.usersPath, require('../routes/user.routes'));
    this.app.use(this.authPath, require('../routes/auth.routes'));
  }

  listen(){
    this.app.listen(this.port, ()=>{
      console.log('Server running at port: ', this.port);
    })
  }

}
module.exports = Server;
