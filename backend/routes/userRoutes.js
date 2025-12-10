const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controller/userController");

const router = express.Router();

//user Management Routes
router.get("/",protect,adminOnly,getUsers);  // get all user(admin Only)
router.get("/:id",protect,getUserById); // get specific user
// router.delete("/:id",protect,adminOnly,deleteUser); // delete user by id

module.exports = router;
