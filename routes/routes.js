const { Router } = require("express");
const {
  getIncompleteTask,
  getCompleteTask,
  saveTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controller/tasksController");
const { login, register } = require("../controller/userController");
const {
  CraeteBoard,
  AddUserInBoard,
  getAllBoard,
  deleteBoard,
  getSingleBoard,
  updateBoard,
} = require("../controller/boardController");
const router = Router();
router.get("/getIncompleteTask", getIncompleteTask);
router.get("/getCompleteTask", getCompleteTask);
router.post("/saveTask", saveTask);
router.put("/updateTaskStatus", updateTaskStatus);
router.get("/getBoard", getAllBoard);
router.get("/getSingleBoard", getSingleBoard);
router.post("/createBoard", CraeteBoard);
router.put("/updateBoard", updateBoard);
router.delete("/deleteBoard", deleteBoard);
router.post("/adduser", AddUserInBoard);
router.post("/login", login);
router.post("/register", register);
router.put("/updateTask", updateTask);
router.delete("/deleteTask", deleteTask);
module.exports = router;
