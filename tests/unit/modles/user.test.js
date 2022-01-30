const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateUserToken", () => {
  it("shoule verfy the jwt..", () => {
    const payload = { _id: mongoose.Types.ObjectId(), isAdmin: true };
    const user = new User(payload);
    const token = user.generateUserToken();

    const decoded = jwt.verify(token, config.get("jwtTokenSecret"));
    expect(decoded).toMatchObject(payload);
  });
});
