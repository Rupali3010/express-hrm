//? router level middleware

const { Router } = require("express");
const multer = require("multer");
const EmpSchema = require("../Model/Employee");
const { ensureAuthenticated } = require("../helper/auth_helper");
const router = Router();

//?load multer middleware
const { storage } = require("../middlewares/multer");

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: storage });
// console.log(upload);

/*@ HTTP-GET METHOD
@ACCESS PUBLIC
@URL employee/home
*/
router.get("/home", async (req, res) => {
  let payload = await EmpSchema.find({}).lean();
  res.render("../views/home", { payload });
});

/*@ HTTP-GET METHOD
@ACCESS PUBLIC
@URL employee/home
*/
router.get("/emp-profile", ensureAuthenticated, async (req, res) => {
  let payload = await EmpSchema.find({ user: req.user.id }).lean();
  res.render("../views/employees/emp-profile", { payload });
});

/*@ HTTP-GET METHOD
@ACCESS PUBLIC
@URL employee/create-app
*/
router.get("/create-emp", ensureAuthenticated, (req, res) => {
  res.render("../views/employees/create-emp", { title: "create employee" });
});

/*@ HTTP-GET METHOD
@ACCESS PUBLIC
@URL employee/edit-emp
*/
router.get("/:id", async (req, res) => {
  let payload = await EmpSchema.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).lean();
  res.render("../views/employees/emp", { payload });
});

/*@ HTTP-GET METHOD
@ACCESS PRIVATE
@URL employee/emp
*/
router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editEmployee = await EmpSchema.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editEmployee });
});

/*@ HTTP-POST METHOD
@ACCESS PRIVATE
@URL employee/create-app
*/

//? put method starts here
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  let payload = {
    emp_photo: req.file,
    emp_name: req.body.emp_name,
    emp_id: req.body.emp_id,
    emp_salary: req.body.emp_salary,
    emp_edu: req.body.emp_edu,
    emp_exp: req.body.emp_exp,
    emp_skills: req.body.emp_skills,
    emp_gender: req.body.emp_gender,
    emp_phone: req.body.emp_phone,
    emp_email: req.body.emp_email,
    user: req.user.id,
  };

  // await EmpSchema.create(payload);
  let body = await new EmpSchema(payload).save();
  req.flash("SUCCESS_MESSAGE", "successfully created");
  res.redirect("/employee/home", 302, { body });
});

/*@ HTTP-PUT METHOD
@ACCESS PRIVATE
@URL employee/create-app
*/

router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EmpSchema.findOne({ _id: req.params.id })
    .then(editEmp => {
      (editEmp.emp_photo = req.file),
        (editEmp.emp_name = req.body.emp_name),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_edu = req.body.emp_edu),
        (editEmp.emp_exp = req.body.emp_exp),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_gender = req.body.emp_gender),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_email = req.body.emp_email),
        //? update data in database
        editEmp.save().then(_ => {
          req.flash("SUCCESS_MESSAGE", "successfully updated");
          res.redirect("/employee/home", 302, {});
        });
    })
    .catch(err => {
      req.flash("ERROR_MESSAGE", "something went wrong");
      console.log(err);
    });
});

/*@ HTTP-DELETE METHOD
@ACCESS PUBLIC
@URL employee/delete-emp
*/
router.delete("/delete-emp/:id", async (req, res) => {
  await EmpSchema.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "successfully employee deleted");
  res.redirect("/employee/home", 302, {});
});

/* END ALL GET METHODS */
module.exports = router;
