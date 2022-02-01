const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest"); // this return a function that we call a requet
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
let server;

describe("/api/geners", () => {
  beforeEach(() => {
    server = require("../../../index");
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

    it("should return 404 if id is not a valid genre ", async () => {
      const validId = mongoose.Types.ObjectId();
      const res = await request(server).get(`/vidly.com/api/genres/${validId}`);
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

  describe("Put /", () => {
    let id;
    let token;
    let name;

    const exce = () => {
      return request(server)
        .put(`/vidly.com/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      id = mongoose.Types.ObjectId();
      token = new User().generateUserToken();
      name = "Genre1";
    });

    it("should return 401 if user is not authorized", async () => {
      token = "";
      const res = await exce();
      expect(res.status).toBe(401);
    });

    it("should return 404 if id is not valid", async () => {
      id = "123";
      const res = await exce();
      expect(res.status).toBe(404);
    });

    it("should return 400 if req.body is not valid", async () => {
      name = "Ge";
      const res = await exce();
      expect(res.status).toBe(400);
    });
    it("should return 404 if genre Id does not exist", async () => {
      const res = await exce();
      expect(res.status).toBe(404);
    });
    it("should return the genere in the response", async () => {
      const genre = new Genre({ name });
      await genre.save();
      id = genre._id;
      name = "updated";
      const res = await exce();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
    });
  });

  describe("Delete /", () => {
    let id;
    let token;

    const exce = () => {
      return request(server)
        .delete(`/vidly.com/api/genres/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(() => {
      id = mongoose.Types.ObjectId();
      token = new User({ isAdmin: true }).generateUserToken();
    });

    it("should return 401 if user is not authorized", async () => {
      token = "";
      const res = await exce();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user not admin", async () => {
      token = new User({ isAdmin: false }).generateUserToken();
      const res = await exce();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is not valid", async () => {
      id = "123";
      const res = await exce();
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre Id does not exist", async () => {
      const res = await exce();
      expect(res.status).toBe(404);
    });
    it("should return the genere in the response", async () => {
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      id = genre._id;

      const res = await exce();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });

    it("should delete genre from the data base", async () => {
      const genre = new Genre({ name: "Genre1" });
      await genre.save();
      id = genre._id;
      await exce();
      const res = Genre.findById(id);
      expect(res.body).toBeFalsy();
    });
  });
});
