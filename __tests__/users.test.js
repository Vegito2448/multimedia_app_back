const mongoose = require("mongoose");
const { User, Role } = require("../models");
const { server } = require("../app");
const { initialUsers, initialRoles, api } = require("../helpersTest");

beforeEach(async () => {
  await Role.deleteMany({});
  await Role.insertMany(initialRoles);
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

describe("/api/users", () => {
  it("GET respond with json containing a list of all users", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("GET respond with json containing a list of all users", async () => {
    const response = await api.get("/api/users");
    expect(response.body.users).toHaveLength(initialUsers.length);
  });

  it('GET first user is named "Armando Arellano"', async () => {
    const response = await api.get("/api/users");
    const names = response.body.users.map((user) => user.name);
    expect(names).toContain("Armando Arellano");
  });

  it("respond with json containing a list of all users", async () => {
    const response = await api.get("/api/users");
    expect(response.body.total).toBe(initialUsers.length);
  });

  it("respond with json properties", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("users");
  });

  it("add one user", async () => {
    const newUser = {
      name: "Jose Perez",
      mail: "jose@mail.com",
      password: "12345678",
      role: "creator",
      userName: "José",
      google: false,
      status: true,
    };

    const createUser = await api
      .post("/api/users/")
      .set("Content-Type", "application/json")
      .send(newUser);

    const response = await api.get("/api/users");

    const names = response.body.users.map(({ name }) => name);

    expect(names).toContain(newUser.name);
    expect(response.body.users).toHaveLength(initialUsers.length + 1);
  });
});

// describe("POST /api/users", () => {});
