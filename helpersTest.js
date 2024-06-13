const { app } = require("./app");
const supertest = require("supertest");

const api = supertest(app);

const initialRoles = [
  {
    role: "admin",
  },
  {
    role: "creator",
  },
  {
    role: "reader",
  },
];

const initialUsers = [
  {
    name: "Armando Arellano",
    mail: "arellano@mail.com",
    password: "12345678",
    role: "admin",
    userName: "arellano",
    google: false,
    status: true,
  },
  {
    name: "Juan Perez",
    mail: "perez@mail.com",
    password: "12345678",
    role: "creator",
    userName: "perez",
    google: false,
    status: true,
  },
];

module.exports = {
  initialUsers,
  api,
  initialRoles,
};
