const LocalStrategy = require("passport-local").Strategy;
// compare database password we need bcrypt
const bcrypt = require("bcryptjs");
const USERSCHEMA = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await USERSCHEMA.findOne({ email });
        //   checking user exists or not
        if (!user) {
          done(null, false, { message: "User not exist" });
        } else {
          done(null, user, { message: "User is here" });
        }
        // match password (end user password,db password)
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            done(null, false, { message: "Password is not match" });
          }
        });
      }
    )
  );
  // used to serialize the user for the session:converting object into stream
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // used to deserialize the user:converting stream into object
  passport.deserializeUser(function (id, done) {
    USERSCHEMA.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
