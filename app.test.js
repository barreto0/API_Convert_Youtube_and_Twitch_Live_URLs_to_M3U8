const app = require("./app");
const request = require("supertest");

describe("Sample test", () => {
  it("should test that true === true", () => {
    const result = true;
    expect(result).toBe(true);
  });
});

describe("Test server", () => {
  it("should GET root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
