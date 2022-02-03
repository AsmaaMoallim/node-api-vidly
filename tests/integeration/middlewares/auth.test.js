const { after } = require("lodash");
const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
let server;
describe("auth middleware POST", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  afterAll(async () => {
    await server.close();
  });
  let token;
  
  const exec = async () => {
    return await request(server)
      .post("/vidly.com/api/genres/")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateUserToken();
  });

  it("should return 401 if no token provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is not a valid one", async () => {
    token = "123";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid ", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
