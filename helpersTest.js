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
    password: "$2a$10$gcJZVoKyIV45YSuPfSQnYe912vt4/Zs2rmrBNikKUtV1amsegt4i.",
    role: "admin",
    userName: "arellano",
    google: false,
    status: true,
  },
  {
    name: "Juan Perez",
    mail: "perez@mail.com",
    password: "$2a$10$gcJZVoKyIV45YSuPfSQnYe912vt4/Zs2rmrBNikKUtV1amsegt4i.",
    role: "creator",
    userName: "perez",
    google: false,
    status: true,
  },
];

const getAllUsers = async () => {
  const response = await api.get("/api/users");

  return response.body;
};

const getAllUsersByNames = async () => {
  const response = await getAllUsers();
  return response.users.map((user) => user.name);
};

const login = async (user) => {
  const response = await api.post("/api/auth/login").send(user);

  return response.body;
};

module.exports = {
  initialUsers,
  api,
  initialRoles,
  getAllUsers,
  getAllUsersByNames,
  login,
};
