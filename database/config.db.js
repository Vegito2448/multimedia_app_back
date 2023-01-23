const mongoose = require('mongoose');

const dbConnection = async()=>{
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.MONGODB_CNN,
    err => {
      if (err) {
          console.log(err);
          throw err
        };
        console.log('connected to MongoDB')
    });
}
module.exports = {
  dbConnection
}