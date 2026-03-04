// Test file for authentication routes
const request = require("supertest");
const app = require("../index");

describe("Auth API", () => {

  test("GET / should return server message", async () => {

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
  });

});