const mongoose = require("mongoose");
const tasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  createdBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  updatedBy: {
    name: { type: String },
    email: { type: String },
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date,
  },
  adminId: {
    type: String,
    required: true,
  },
  assign: {
    name: { type: String },
    email: { type: String },
  },
  completeStatus: {
    type: String,
    required: true,
  },
});
tasksSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.user;
    delete returnedObject.adminId;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Task", tasksSchema);
