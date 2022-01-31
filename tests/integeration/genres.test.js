const request = require("supertest"); // this return a function that we call a requet
const { Genre } = require("../../models/genre");
let server;

describe("/api/geners", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove();
  });

  describe("GET / ", () => {
    it("should return all genres", async () => {
        await Genre.collection.insertMany([
          { name: "Genre1" },
          { name: "Genre2" },
          { name: "Genre3" }
        ]);
      const res = await request(server).get("/vidly.com/api/genres"); //maybe is theis one
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    //   expect(
    //     res.body.some((g) => {
    //       g.name === "Genre1";
    //     })
    //   ).toBeTruthy();
    });
  });
});
