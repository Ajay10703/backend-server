const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  admin: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  adminId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date,
  },
  users: {
    type: [
      {
        name: { type: String },
        email: { type: String },
      },
    ],
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
