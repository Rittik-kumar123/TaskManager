const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Generate Jwt token
const GenerateToken = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn : "7d"});
};

//@desc Register a User
//@route POST /api/auth/register
//@access Public
const registerUser=async(req,res)=>{
    try {
        const{name,email,password,profileImageUrl,adminInviteToken} = req.body;
        //check if user already exist
        const userExit=await User.findOne({email});
        if(userExit)
        {
            return res.status(400).json({message:"User Already Exit"});
        }
        //check the role of the user by adminInviteToken if correct than admin else member
        let role="member";
        if(adminInviteToken && process.env.ADMIN_INVITE_TOKEN){
            role="admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        //create User
        const user = await User.create(
            {
                name,
                email,
                password:hashPassword,
                profileImageUrl,
                role,
            }
        );
        //return user with token
        res.status(201).json({
            _id : user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:GenerateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

//@desc LogIn a User
//@route POST /api/auth/login
//@access Public
const loginUser=async(req,res)=>{
    try {
       const {email,password} = req.body; 
       const user = await User.findOne({email});
       if(!user)
       {
        return res.status(400).json({message:"Register First then login"});
       }
       //compare password
       const isMatch =await bcrypt.compare(password,user.password);
       if(!isMatch)
       {
        return res.status(401).json({message:"Wrong Password Please Try again.."});
       }
       //return user data
       res.status(201).json({
            _id : user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:GenerateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

//@desc get a User profile
//@route GET /api/auth/profile
//@access Private(require Jwt)
const getUserProfile=async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user)
        {
            return res.status(404).json({message:"User Not Found"});
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

//@desc update a User Profile
//@route PUT /api/auth/profile
//@access private(require JWT)
const updateUserProfile=async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if(!user)
        {
            return res.status(401).json({message:"User is not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.user)
        {
            const salt = await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password,salt);
        }
        updatedUser = await user.save();
        res.json({
            _id:updadatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            role:updatedUser.role,
            token:GenerateToken(updadatedUser._id),
        });
    } catch (error) {
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

module.exports = {registerUser , loginUser , getUserProfile ,  updateUserProfile};





