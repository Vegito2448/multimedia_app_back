const mongoose = require("mongoose");
const supertest = require("supertest");
const { User } = require("../models");
const { app, server } = require("../app");

const api = supertest(app);

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

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

describe("GET /api/users", () => {
  it("respond with json containing a list of all users", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("respond with json containing a list of all users", async () => {
    const response = await api.get("/api/users");
    expect(response.body.users).toHaveLength(initialUsers.length);
  });
});
