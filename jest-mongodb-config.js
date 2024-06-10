// jest-mongodb-config.js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "4.2.6", // Specify the MongoDB version you need
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: "jest",
    },
  },
};
