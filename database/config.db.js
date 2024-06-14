require("dotenv").config();
const mongoose = require("mongoose");

const { MONGODB_CNN, MONGODB_CNN_TEST, NODE_ENV } = process.env;

const uri = NODE_ENV === "test" ? MONGODB_CNN_TEST : MONGODB_CNN;

const dbConnection = async () =>
  await mongoose.connect(uri).then(() => console.log("connected to MongoDB"));

dbConnection().catch(console.log);

module.exports = {
  dbConnection,
};
