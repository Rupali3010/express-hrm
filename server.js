const express = require("express");
const { PORT, MONGODB_URL } = require("./config");
const { connect } = require("mongoose");
const app = express();
const { engine } = require("express-handlebars");
const passport = require("passport");
const { join } = require("path");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
require("./middlewares/passport")(passport);

//? importing all routing here
const EmployeeRouter = require("./Route/employee");
const AuthRoute = require("./Route/auth");

//?================ Template engine starts here ==============
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//? session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//?connect-flash middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});

//?======== Template engine starts here =========

//!================= database connection starts here===================
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("Database is connected");
};
DatabaseConnection();
//!================== database connection end here =================

//? ============ built-in middleware starts here =================
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//? ========== built-in middleware ends here ===================

Handlebars.registerHelper("trim", function (passedString) {
  if (typeof passedString[0] === "string") {
    var theString = passedString[0];
  } else {
    var theString = passedString[0].path.slice(6);
  }
  return new Handlebars.SafeString(theString);
});

Handlebars.registerHelper("trimString", function (passedString) {
  console.log(passedString);
  if (typeof passedString[0] === "string") {
    var theString = passedString[0];
  } else {
    var theString = passedString[0].path.slice(6);
  }
  return new Handlebars.SafeString(theString);
});

//? =============== Routing starts here ===================
app.use("/employee", EmployeeRouter);
app.use("/auth", AuthRoute);
//? ============ Routing ends here =====================

//?set global variable

//? ============= listen port ============
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is running on PORT number ${PORT}`);
});
