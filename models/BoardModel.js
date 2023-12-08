const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  boardKey: {
    type: String,
  },
  users: {
    type: Array,
  },
});
boardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.admin;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Board", boardSchema);
