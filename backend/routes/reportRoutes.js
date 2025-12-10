const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controller/reportController");
const router = express.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);//Export all task as pdf file
router.get("/export/users",protect,adminOnly,exportUsersReport);//Export User Task report

module.exports=router;