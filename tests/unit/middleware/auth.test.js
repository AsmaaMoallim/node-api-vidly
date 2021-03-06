const mongoose = require("mongoose");
const auth = require("../../../middlewares/auth");
const { User } = require("../../../models/user");

describe("auth middleware", () => {
  it("should populate the body with payload of a valid JWT", () => {
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
    const token = new User(user).generateUserToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
