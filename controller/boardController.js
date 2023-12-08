const BoardList = require("../models/BoardModel");
const userList = require("../models/userModel");
const bcrypt = require("bcryptjs");
module.exports.getAllBoard = async (req, res) => {
  const { name, data } = req.user;
  console.log(req.user);
  const Boards = await BoardList.find({ admin: { name: name, email: data } });
  const Boards2 = await BoardList.find({
    users: [{ name: name, email: data }],
  });
  let boardexist = [...Boards, ...Boards2];
  if (boardexist[0]) {
    res.send(
      boardexist.map((e) => {
        return {
          title: e.title,
          adminId: e.adminId,
        };
      })
    );
  } else {
    return res.status(401).send({
      message: "board not found",
    });
  }
};
module.exports.CraeteBoard = (req, res) => {
  console.log(req);
  const { name, data } = req.user;
  const { title } = req.body;

  const salt = bcrypt.genSaltSync(10);
  req.user.data = bcrypt.hashSync(data, salt);
  BoardList.create({
    title,
    admin: {
      name: name,
      email: data,
    },
    adminId: req.user.data,
    createdOn: new Date(),
  })
    .then((data) => {
      console.log("board created successfully");
      console.log(data);
      res.status(201).send({
        status: true,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.AddUserInBoard = async (req, res) => {
  const { name, data } = req.user;
  const { user, id } = req.body;
  const boardexist = await BoardList.findOne({
    admin: { name: name, email: data },
    adminId: id,
  });
  if (user === undefined || !user) {
    return res.status(401).send({ message: "email is required" });
  }
  let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(user);
  let parts = user.split("@");
  let domainParts = parts[1]?.split(".");
  if (
    user.length > 254 ||
    !valid ||
    parts[0].length > 64 ||
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return res.status(401).send({ message: "email not valid" });
  }
  const User = await userList.findOne({ email: user });
  if (user === data) {
    return res.status(401).send({ message: "You can't add userself again" });
  }
  if (!boardexist) {
    return res.status(401).send({
      message: "Only admin canadd users to board or this board not exist",
    });
  } else {
    console.log(User);
    if (User) {
      let userexist = false;
      let userpresent = [];
      if (boardexist.users?.length > 0) {
        userexist = false;
        userpresent = boardexist.users.filter((e) => {
          return e.email === user;
        });
      } else {
        userexist = true;
      }
      console.log(userexist);
      if (userexist === true || userpresent.length == 0) {
        BoardList.findByIdAndUpdate(boardexist.id, {
          users: [...boardexist?.users, { name: User.name, email: User.email }],
        })
          .then((data) => {
            console.log("user added successfully");
            console.log(data);
            res.status(201).send("user added successfully");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(401).send({
          message: "user already added",
        });
      }
    } else {
      return res.status(401).send({ message: "user  not exist" });
    }
  }
};
module.exports.getSingleBoard = (req, res) => {
  const { data } = req.user;
  const { id } = req.query;
  BoardList.findOne({ adminId: id })
    .then((response) => {
      let isAdmin = data === response.admin.email;
      let DATA = isAdmin
        ? {
            admin: response.admin,
            title: response.title,
            id: response.id,
            adminId: response.adminId,
            users: response.users,
          }
        : {
            title: response.title,
            adminId: response.adminId,
          };
      console.log({ status: true, isAdmin: isAdmin, response });
      res.status(200).send({ status: true, isAdmin: isAdmin, data: DATA });
    })
    .catch((err) => {
      res.status(401).send({
        message: "board not found",
      });
    });
};
module.exports.updateBoard = (req, res) => {
  const { title, id } = req.body;
  BoardList.findByIdAndUpdate(id, { title, updatedOn: new Date() })
    .then((data) => {
      console.log("updated successfully");
      console.log(data);
      res.status(201).send("updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.deleteBoard = (req, res) => {
  const { id } = req.query;
  BoardList.findByIdAndDelete(id)
    .then((response) => {
      res.status(201).send("delete successfully");
    })
    .catch((err) => {
      res.status(401).send("Only admin can delete the board");
      console.log(err);
    });
};
