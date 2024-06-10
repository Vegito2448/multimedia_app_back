const mongoose = require('mongoose');

const uri = process.env.MONGODB_CNN || global.__MONGO_URI__;

const dbConnection = async () =>
  await mongoose
    .connect(process.env.MONGODB_CNN)
    .then(() => console.log("connected to MongoDB"));

dbConnection().catch(console.log);

module.exports = {
  dbConnection
}