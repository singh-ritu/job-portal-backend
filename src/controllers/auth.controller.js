import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    try {
        const  { name, email, password, role } = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({message: "All fields are required"})
        }
        
        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Email already exists"}) 
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        
        return res.status(201).json({message: "User registered successfully"});

        } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


const loginUser = async (req, res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({message:"User does not exist"})
        }

        const isPasswordCorrect  = await existingUser.matchPassword(password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = jwt.sign(
            {_id : existingUser._id, role: existingUser.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        console.log("role:", existingUser.role);
        res.cookie("token", token, {
                httpOnly: true,
                secure: false, // true in production
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                path:"/",
            });
            
        res.json({
            message: "Login successful",
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                jobType: existingUser.jobType,
                experienceLevel: existingUser.experienceLevel,
            },
        })


    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

const getMe = async (req,res) => {
    
     try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false 
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
};

export { registerUser, loginUser, getMe, logoutUser };