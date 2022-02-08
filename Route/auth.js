const { Router } = require("express");
const router = Router();

/* HTTP GET METHOD
@ACCESS PUBLIC
@URL /auth/register
 */
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});

/* HTTP POST METHOD
@ACCESS PUBLIC
@URL /auth/register
 */
router.post("/register", (req, res) => {
  let { username, email, password, password1 } = req.body;
  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (!email) {
    errors.push({ text: "email is required" });
  }
  if (!password) {
    errors.push({ text: "password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "password is not match" });
  }
  if (errors.length > 0) {
    res.redirect("/auth/register", 302, {
      username,
      email,
      password,
      password1,
    });
  } else {
    res.send("ok");
  }
});

module.exports = router;
