const mongoose = require("mongoose");
const { User, Role } = require("../models");
const { server } = require("../app");
const {
  initialUsers,
  initialRoles,
  api,
  getAllUsersByNames,
  getAllUsers,
  login,
} = require("../helpersTest");

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
    const response = await getAllUsers();
    expect(response.users).toHaveLength(initialUsers.length);
  });

  it('GET first user is named "Armando Arellano"', async () => {
    const names = await getAllUsersByNames();
    expect(names).toContain("Armando Arellano");
  });

  it("respond with json containing a list of all users", async () => {
    const response = await getAllUsers();

    console.log(`🚀 ~ it ~ response:`, response);

    expect(response.total).toBe(initialUsers.length);
  });

  it("respond with json properties", async () => {
    const response = await getAllUsers();
    expect(response).toHaveProperty("total");
    expect(response).toHaveProperty("users");
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

    const names = await getAllUsersByNames();
    const response = await getAllUsers();

    expect(names).toContain(newUser.name);
    expect(response.users).toHaveLength(initialUsers.length + 1);
  });

  it("user to delete", async () => {
    const response = await getAllUsers();

    const userToDelete = response.users[1];

    const Login = await login({
      mail: "arellano@mail.com",
      password: "12345678",
    });

    await api
      .delete(`/api/users/${userToDelete._id}`)
      .set("x-token", Login.token)
      .expect(204);

    const names = await getAllUsersByNames();

    const responseAfterDelete = await getAllUsers();

    expect(names).not.toContain(userToDelete.name);
    expect(responseAfterDelete.users).toHaveLength(initialUsers.length - 1);
  });
});
