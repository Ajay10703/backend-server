const mongoose = require("mongoose");
const tasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  completeStatus: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
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
