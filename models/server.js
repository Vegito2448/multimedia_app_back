const express = require('express');
const cors = require('cors');

class Server{
  
  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    //Middlewares
    this.middlewares();
    // App routes
    this.routes();
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
  }

  listen(){
    this.app.listen(this.port, ()=>{
      console.log('Server runing in port: ', this.port);
    })
  }

}
module.exports = Server;
