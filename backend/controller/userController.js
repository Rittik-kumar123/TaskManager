const Task = require("../models/Task");
const task = require("../models/Task");
const User = require("../models/User");
const user = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc get all the user
//api get /api/users/
//@access private(adminOnly)

const getUsers = async(req,res) => {
    try{
            const users = await User.find({role:"member"}).select("-password");
            //add task count to each user
            const userWithTaskCount = await Promise.all(
                users.map(async(user)=>{
                    const PendingTask = await Task.countDocuments({
                        assignedTo : user._id,
                        status : "Pending",
                    });
                    const inProgressTask = await Task.countDocuments({
                        assignedTo : user._id,
                        status:"In Progress",
                    });
                    const completedTask = await Task.countDocuments({
                        assignedTo : user._id,
                        status:"Completed",
                    });
                    return{
                        ...user._doc,//Includes All user existing data
                        PendingTask,
                        inProgressTask,
                        completedTask,
                    };
                })
            )
            return res.status(200).json(userWithTaskCount);
    }
    catch(error)
    {
        res.status(500).json({message:"Server Error",error : error.message});
    }
}




//@desc get specific user by id
//api get /api/users/:id
//@access private
const getUserById = async(req,res) => {
    try{
            const user = await User.findById(req.params.id).select("-password");
            if(!user) res.status(400).json({message:"User not present.."});

            return res.json(user);
    }
    catch(error)
    {
        res.status(500).json({message:"User not present"});
    }
}

//@desc delete specific user by id
//api delete /api/users/:id
//@access private(adminOnly)

// const deleteUser = async(req,res) => {
//     try{
//         const userId = req.params.id;

//     // Check user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Delete user
//     await User.findByIdAndDelete(userId);

//     return res.status(200).json({ message: "User deleted successfully" });
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"User not present"});
//     }
// }

module.exports = {getUsers, getUserById};