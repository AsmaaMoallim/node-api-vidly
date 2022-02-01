const jwt = require("jsonwebtoken");
const request = require("supertest"); // this return a function that we call a requet
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/geners", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET / ", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "Genre1" },
        { name: "Genre2" },
        { name: "Genre3" },
      ]);
      const res = await request(server).get("/vidly.com/api/genres"); //maybe is theis one
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "Genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Genre2")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Genre3")).toBeTruthy();
    });
  });

  describe("GET /:id ", () => {
    it("should return one genre", async () => {
      const genre = new Genre({
        name: "Genre1",
      });
      await genre.save();

      //   await Genre.collection.insertOne(genre);

      const res = await request(server).get(
        `/vidly.com/api/genres/${genre._id}`
      ); //maybe is theis one
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if id not valid ", async () => {
      const res = await request(server).get("/vidly.com/api/genres/1");
      expect(res.status).toBe(404);
    });
  });

  describe("Post /", () => {
    // refactoring
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateUserToken();
      name = "Genre1";
    });

    const exce = async () => {
      return await request(server)
        .post("/vidly.com/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return a 401 if user not authorised ", async () => {
      token = "";
      const res = await exce();
      expect(res.status).toBe(401);
    });

    it("should return a 400 if req body is not valid (less than 3 characters)", async () => {
      name = "123";
      const res = await exce();
      expect(res.status).toBe(400);
    });

    it("should return a 400 if req body is not valid (greater than 50  characters)", async () => {
      name = new Array(52).join("a");
      const res = await exce();
      expect(res.status).toBe(400);
    });

    it("should save the genre if valid", async () => {
      await exce();
      const genre = await Genre.find({ name: "Genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return the genre if valid", async () => {
      const res = await exce();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });
  });
});
