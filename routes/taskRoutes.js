const express = require("express");
const {getTasks, addTask, updateTask, deleteTask} = require("../controllers/taskControllers");
const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", addTask);
router.put("/tasks", updateTask);
router.delete("/tasks", deleteTask);

module.exports = router;