// Add mongoose to the top of your test file
const mongoose = require("mongoose");
const { userGet } = require("../controllers/users.controller");
const { User } = require("../models");

// Mock database connection
jest.mock("../database/config.db", () => {
  const mongooseMock = require("mongoose");
  return { connect: jest.fn().mockResolvedValue(mongooseMock) };
});

// Mock User model
jest.mock("../models/user", () => {
  return {
    findOne: jest.fn().mockResolvedValue({
      // Mocked user object
      _id: "6664fcb47064b414ee048e5a",
      name: "Test User",
      email: "test@example.com",
    }),
  };
});

describe("userGet", () => {
  let req, res;

  beforeAll(async () => {
    // No actual DB connection needed, using mock
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    req = { params: { id: "6664fcb47064b414ee048e5a" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return a user successfully", async () => {
    await userGet(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "6664fcb47064b414ee048e5a",
      name: "Test User",
      email: "test@example.com",
    });
  });
});
