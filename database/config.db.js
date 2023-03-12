const mongoose = require('mongoose');


const dbConnection = async () => await mongoose.connect(process.env.MONGODB_CNN).then(() => console.log('connected to MongoDB'));

dbConnection().catch(console.log);

module.exports = {
  dbConnection
}