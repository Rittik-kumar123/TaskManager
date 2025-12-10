const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware To Protect Routes
// const protect = async(req,res,next)=>{
//     try {
//         let token = req.headers.authorization;
//         if(token && token.startsWith("Bearer"))
//         {
//             token = token.split(" ")[1];//Extract token
//             const decoded = jwt.verify(token,process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             return next();
//         }
//         else{
//             res.status(401).json({message:"Not authorized,No Token"});
//         }
//     }
//     catch(error){
//         res.status(400).json({message:"Token Failed",error:error.message});
//     }
// }

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, No Token" });
        }

        token = token.split(" ")[1]; // Extract token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        return next();
    } catch (error) {
        return res.status(400).json({
            message: "Token Failed",
            error: error.message,
        });
    }
};


//Middleware for admin only
const adminOnly = async(req,res,next)=>{
    if(req.user && req.user.role=="admin")
    {
        next();
    }
    else{
        res.status(403).json({message:"Admin Only"});
    }
}

module.exports = {adminOnly,protect};

