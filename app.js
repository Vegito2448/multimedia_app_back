'use strict';
require('dotenv').config();

const Server = require('./models/server');
const server = new Server();
const serverApp = server.listen();

module.exports = { server: serverApp, app: server.app };
