const TaskList = require("../models/TaskModel");
module.exports.getIncompleteTask = async (req, res) => {
  console.log(req.query);
  const { id } = req.query;
  console.log(id);
  const tasks = await TaskList.find({
    adminId: id,
    completeStatus: "incomplete",
  });
  res.send({
    status: true,
    tasks: tasks,
  });
};
module.exports.getCompleteTask = async (req, res) => {
  console.log(req.query);
  const { id } = req.query;
  console.log(id);
  const tasks = await TaskList.find({
    adminId: id,
    completeStatus: "completed",
  });
  res.send({
    status: true,
    tasks: tasks,
  });
};
module.exports.saveTask = (req, res) => {
  console.log(req.user);
  const { name, data } = req.user;
  const { title, desc, adminId } = req.body;
  TaskList.create({
    title,
    desc,
    adminId,
    createdBy: { name: name, email: data },
    completeStatus: "incomplete",
    createdOn: new Date(),
  })
    .then((data) => {
      console.log("saved successfully");
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
module.exports.updateTask = (req, res) => {
  const { name, data } = req.user;
  const { title, desc, id } = req.body;
  TaskList.findByIdAndUpdate(id, {
    title,
    desc,
    updatedBy: { name: name, email: data },
    updatedOn: new Date(),
  })
    .then((data) => {
      console.log("updated successfully");
      console.log(data);
      res.status(201).send("updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.updateTaskStatus = (req, res) => {
  const { name, data } = req.user;
  const { status, id } = req.body;
  TaskList.findByIdAndUpdate(id, {
    completeStatus: status,
    updatedBy: { name: name, email: data },
    updatedOn: new Date(),
  })
    .then((data) => {
      console.log("updated successfully");
      console.log(data);
      res.status(201).send("updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.deleteTask = (req, res) => {
  const { id } = req.query;
  TaskList.findByIdAndDelete(id)
    .then(() => {
      console.log("delete successfully");
      res.status(201).send("delete successfully");
    })
    .catch((err) => {
      res.status(401).send("Only admin can delete the board");
      console.log(err);
    });
};
