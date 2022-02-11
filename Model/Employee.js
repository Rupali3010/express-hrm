const { Schema, model } = require("mongoose");
const EmpSchema = new Schema(
  {
    emp_name: {
      type: String,
      required: true,
    },
    emp_id: {
      type: String,
      required: true,
    },
    emp_photo: {
      type: [""],
      // required: true,
      default: ["https://cdn-icons-png.flaticon.com/512/4333/4333609.png"],
    },
    emp_salary: {
      type: Number,
      required: true,
    },
    emp_skills: {
      type: [""],
      required: true,
    },
    emp_exp: {
      type: Number,
      required: true,
    },
    emp_email: {
      type: String,
      required: true,
    },
    emp_edu: {
      type: String,
      required: true,
    },
    emp_gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    emp_phone: {
      type: Number,
      required: true,
    },
    user: {
      type: [""],
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("emp", EmpSchema);
