require("dotenv").config()
const express = require("express");
const cors = require("cors")
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")

const app = express();

//middleware to handle cors
app.use(
    cors({
        origin : process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
    })
);

//connect database
connectDB();

//Middleware
app.use(express.json());





//Routes
app.use("/api/auth",authRoutes);
app.use("/api/report",reportRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/users",userRoutes);

//server upload file
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.get("/check",(req,res)=>{
    console.log("App is Running");
    res.send("Site is working");
})

//Start Server
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>console.log(`Server is Running in port ${PORT}`));
// app.listen(8000, "0.0.0.0", () => {
//   console.log("Server running on port 8000");
// });
