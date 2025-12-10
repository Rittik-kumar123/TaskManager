const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskCheckList } = require("../controller/taskController");
const router = express.Router();

//Task management
router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getTasks);//admin Only or user:assigned can get all the task
router.get("/:id",protect,getTaskById);//get task by id
router.post("/",protect,adminOnly,createTask);//create task(admin only)
router.put("/:id",protect,updateTask);//update Task Details
router.delete("/:id",protect,adminOnly,deleteTask);//Delete a task(admin Only)
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskCheckList);//update task checklist

module.exports = router;
