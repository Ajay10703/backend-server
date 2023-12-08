const userList = require("../models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");
const login = async ({ email, password }, res) => {
  if (email === undefined || !email) {
    return res({ message: "email is required" });
  }
  let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(email);
  let parts = email.split("@");
  let domainParts = parts[1]?.split(".");
  if (
    email.length > 254 ||
    !valid ||
    parts[0].length > 64 ||
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return res({ message: "email not valid" });
  }
  if (password === undefined || !password) {
    return res({ message: "password is required" });
  }
  if (password.length < 6) {
    return res({ message: "password must be atleast 6 digits" });
  }
  const user = await userList.findOne({ email });
  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(user.name, email);
      return res(null, { ...user.toJSON(), token });
    } else {
      return res({
        message: "Invalid email or password",
      });
    }
  } else {
    return res({
      message: "Invalid email or password",
    });
  }
};

const register = async (req, res) => {
  if (req.name === undefined || !req.name) {
    return res({ message: "name is required" });
  }
  if (req.email === undefined || !req.email) {
    return res({ message: "email is required" });
  }
  let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(req.email);
  let parts = req.email.split("@");
  let domainParts = parts[1]?.split(".");
  if (
    req.email.length > 254 ||
    !valid ||
    parts[0].length > 64 ||
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return res({ message: "email not valid" });
  }
  const email = req.email;
  const userexist = await userList.findOne({ email });
  if (userexist) {
    return res({ message: "email already exist" });
  }
  if (req.password === undefined || !req.password) {
    return res({ message: "password is required" });
  }
  if (req.password.length < 6) {
    return res({ message: "password must be atleast 6 digits" });
  }
  const { password } = req;
  const salt = bcrypt.genSaltSync(10);
  req.password = bcrypt.hashSync(password, salt);

  const user = new userList(req);
  user
    .save()
    .then((data) => {
      console.log("saved successfully");
      console.log(data);
      res(null, data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  login,
  register,
};
