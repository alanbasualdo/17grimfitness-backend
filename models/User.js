const { Schema, model } = require("mongoose");

const User = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dni: {
      type: Number,
    },
    cel: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "UserRole",
      emun: ["AdminRole", "UserRole"],
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

User.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", User);
