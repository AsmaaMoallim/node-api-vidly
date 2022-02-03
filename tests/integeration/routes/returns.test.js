const moment = require("moment");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../../models/movie");
let server;

describe("/api/rentals", () => {
  let rental;
  let customerId;
  let movieId;
  let token;
  let movie;
  const exec = () => {
    return request(server)
      .post("/vidly.com/api/returns/")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateUserToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },

      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should reurn 400 if customerId is not provied", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should reurn 400 if movieId is not provied", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should reurn 404 rental is not found for this customer/movie", async () => {
    await Rental.remove();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should reurn 400 if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should reurn 200 if request is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set the returnDate if input is valid", async () => {
    await exec();
    const ren = await Rental.findById(rental._id);
    const diff = new Date() - ren.dateReturned;
    // expect(ren.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    await exec();
    const ren = await Rental.findById(rental._id);
    expect(ren.rentalFee).toBe(14);
  });

  it("should increase the movie stock", async () => {
    await exec();
    const mov = await Movie.findById(movieId);
    expect(mov.numberInStock).toBe(movie.numberInStock + 1);
  });
  it("should return the rental in the response", async () => {
    const res = await exec();
    const ren = await Rental.findById(rental._id);
    // expect(res.body).toMatchObject(ren);
    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    // expect(res.body).toHaveProperty("movie");

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
