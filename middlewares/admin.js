module.exports = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).send("only admins can prefom this action");
  next();
};
