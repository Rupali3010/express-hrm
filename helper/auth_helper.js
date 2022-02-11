module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("ERROR_MESSAGE", "you are not authorized user");
    res.redirect("/auth/login", 302, {});
  },
};
