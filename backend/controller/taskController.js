const { Promise } = require("mongoose");
const Task = require("../models/Task");
const { deleteOne } = require("../models/User");

//@desc Get all the task(admin or user assigned to)
//Get /api/tasks/
//access private
// const getTasks = async(req,res)=>{
//     try{
//         const{status} = req.query;
//         let filter = {};

//         if(status)
//         {
//             filter.status = status;
//         }

//         let tasks;

//         if(req.user.role === "admin")
//         {
//             tasks = await Task.find(filter).populate(
//                 "assignedTo",
//                 "name email profileImageUrl"
//             );
//         }
//         else{
//             tasks = await Task.find({...filter,assignedTo : req.user._id}).populate(
//                 "assignedTo",
//                 "name email profileImageUrl"
//             );
//         }

//         //Add completed todochecklist count to each task
//         tasks = await Promise.all(
//             tasks.map(async(task)=>{
//                 const completedCount = task.todoCheckList.filter(
//                     (item) => item.completed
//                 ).length;
//                 return {...task._doc,completedTodoCount:completedCount};
//             })
//         );

//         //status Summary Count
//         const allTasks = await Task.countDocuments(
//             req.user.role === "admin"?{}:{assignedTo:req.user._id}
//         );

//         const pendingTask = await Task.countDocuments({
//             ...filter,
//             status:"Pending",
//             ...(req.user.role !== "admin" && {assignedTo : req.user._id}),
//         });

//         const inProgressTask = await Task.countDocuments({
//             ...filter,
//             status:"In Progress",
//             ...(req.user.role !== "admin" && {assignedTo : req.user._id}),
//         });

//         const completedTask = await Task.countDocuments({
//             ...filter,
//             status:"Complete",
//             ...(req.user.role !== "admin" && {assignedTo : req.user._id}),
//         });

//         res.json({
//             tasks,
//             statusSummary :{
//                 all:allTasks,
//                 pendingTask,
//                 inProgressTask,
//                 completedTask,
//             },
//         });
//     }
//     catch(error)
//     {
//         return res.status(500).json({message:"Server Error",error:error.message});
//     };
// };
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id,
            }).populate("assignedTo", "name email profileImageUrl");
        }

        // add completed checklist count
        tasks = tasks.map(task => {
            const completedCount = task.todoCheckList.filter(i => i.completed).length;
            return { ...task._doc, completedTodoCount: completedCount };
        });

        // summary
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTask = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTask = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTask = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTask,
                inProgressTask,
                completedTask,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};


//@desc Get the task by id
//Get /api/tasks/:id
//access private

const getTaskById = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        if(!task) res.status(404).json({message:"Task has not yet assigned"});
        res.json(task);
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

//@desc create the task(admin only)
//Post /api/tasks/
//access private(Admin)
const createTask = async(req,res)=>{
    try{
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        }=req.body;
        if(!Array.isArray(assignedTo))
        {
            return res.status(401).json({message:"Assigned to must be an array of user ID"});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoCheckList,
            attachments,
        });
        res.status(201).json({message:"Task Created Succesfully..",task})
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

//@desc update task
//Put /api/tasks/:id
//access private
const updateTask = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task) res.status(404).json({message:"Task has not yet assigned"});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo)
        {
            if(!Array.isArray(req.body.assignedTo))
            {
                return res.status(401).json({message:"Assigned to must be an array of user ID"});
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({message:"Task Upddated Successfully...",updatedTask});
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

//@desc delete task (admin Only)
//Delete /api/tasks/:id
//access private(admin)
const deleteTask = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task) res.status(404).json({message:"Task has not yet assigned"});

        await task.deleteOne();
        res.json({message:"Task Deleted Successfully... "});
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

//@desc update task status
//Put /api/tasks/:id/status
//access private
const updateTaskStatus = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        

        if(!task) {
            res.status(404).json({message:"Task has not yet assigned"});
        }

        const isAssigned = task.assignedTo.some(
            (userId)=>userId.toString()===req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin")
        {
            res.status(403).json({message:"Bhai Kya Kar rha hai tu.. You are not authorized bro"});
        }
        
        task.status = req.body.status || task.status;

        if(task.status === "Completed"){
            task.todoCheckList.forEach((item)=>item.completed = true);
            task.progress=100;
        }

        await task.save();
        res.json({message:"Task Status Updated Successfully ...",task});
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

//@desc update task checkList
//Put /api/tasks/:id/todo
//access private
const updateTaskCheckList = async (req, res) => {
    try {
        const { todoCheckList } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // authorization check 
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to update this checklist"
            });
        }

        // update checklist
        task.todoCheckList = todoCheckList;

        // auto progress update
        const completedCount = todoCheckList.filter(item => item.completed).length;
        const totalItems = todoCheckList.length;

        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // auto status update
        if (task.progress === 100) task.status = "Completed";
        else if (task.progress > 0) task.status = "In Progress";
        else task.status = "Pending";

        await task.save();

        // fetch updated task
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        return res.json({
            message: "Task Check List Updated...",
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


//@desc get dashboard data
//get /api/tasks/dashboard-data
//access private
const getDashboardData = async(req,res)=>{
    try{
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status:"Pending"});
        const completedTasks = await Task.countDocuments({status:"Completed"});
        const overdueTasks = await Task.countDocuments({
            status:{$ne:"Completed"},
            dueDate:{$lt:new Date()},
        });

        //Ensure all Possible status are Included
        const taskStatuses = ["Pending","In Progress","Completed"];
        const taskDistributionRow = await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum: 1},
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc,status)=>{
            const formattedKey = status.replace(/\s+/g,"");//Remove Spaces from response key
            acc[formattedKey]=
                taskDistributionRow.find((item)=>item._id===status)?.count || 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks;//add total count to task distribution

        //Ensure all Priority Level included
        const taskPriorities=["Low","Medium","High"];
        const taskPriorityLevelsRow = await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count:{$sum: 1},
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
                taskPriorityLevelsRow.find((item)=>item._id===priority)?.count || 0;
            return acc;
        },{});

        //Fetch 10 task
        const recentTasks = await Task.find()
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });


    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};
//@desc get user dashboard data
//get /api/tasks/user-dashboard-data
//access private
const getUserDashboardData = async(req,res)=>{
    try{
        
        const userId=req.user._id;

        const totalTasks = await Task.countDocuments({assignedTo:userId});
        const pendingTasks = await Task.countDocuments({assignedTo:userId,status:"Pending"});
        const completedTasks = await Task.countDocuments({assignedTo:userId,status:"Completed"});
        const overdueTasks = await Task.countDocuments({
            assignedTo:userId,
            status:{$ne:"Completed"},
            dueDate:{$lt:new Date()},
        });

        //Ensure all Possible status are Included
        const taskStatuses = ["Pending","In Progress","Completed"];
        const taskDistributionRow = await Task.aggregate([
            {
                $match:{assignedTo:userId}
            },
            {
                $group:{
                    _id:"$status",
                    count:{$sum: 1},
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc,status)=>{
            const formattedKey = status.replace(/\s+/g,"");//Remove Spaces from response key
            acc[formattedKey]=
                taskDistributionRow.find((item)=>item._id===status)?.count || 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks;//add total count to task distribution

        //Ensure all Priority Level included
        const taskPriorities=["Low","Medium","High"];
        const taskPriorityLevelsRow = await Task.aggregate([
            {
                $match:{assignedTo:userId}
            },
            {
                $group:{
                    _id:"$priority",
                    count:{$sum: 1},
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
                taskPriorityLevelsRow.find((item)=>item._id===priority)?.count || 0;
            return acc;
        },{});

        //Fetch 10 task
        const recentTasks = await Task.find({assignedTo:userId})
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });

    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error",error:error.message});
    };
};

module.exports = {
    getUserDashboardData,
    getDashboardData,
    updateTaskCheckList,
    updateTaskStatus,
    deleteTask,
    updateTask,
    createTask,
    getTaskById,
    getTasks
};