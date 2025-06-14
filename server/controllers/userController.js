import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; //fetch data from model user body

    //check details are not empty
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //check user exists or not find user by email
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({ success: false, message: "User already Exists" });

    //hashed pwd in encrypted form
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const user = await User.create({ name, email, password: hashedPassword });

    //create token for pwd
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //token stored in cookie
    res.cookie("token", token, {
      httpOnly: true, //Prevent the javascript to access cookie
      secure: process.env.NODE_ENV === "production", //true //use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //secure from CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // expiration time cookie
    });

    return res.json({
      success: true,
      message: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message),
      res.json({
        success: false,
        message: error.message,
      });
  }
};

//existing user LOGIN :  /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are Required",
      });
    }

    //find user from databasee
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //match password given by user and database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password does not match",
      });
    }

    //if pwd matching we generate token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //token stored in cookie
    res.cookie("token", token, {
      httpOnly: true, //Prevent the javascript to access cookie
      secure: process.env.NODE_ENV === "production", //true //use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //secure from CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // expiration time cookie
    });

    return res.json({
      success: true,
      message: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message),
      res.json({
        success: false,
        message: error.message,
      });
  }
};



//check AUTH : /api/user/is-auth
export const isAuth = async (req,res) =>{

    try{
        const {userId} = req.body;

        const user= await User.findById(userId).select("-password");

        return res.json({
            success:true,
            user
        })

    }
    catch(error)
    {
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })

    }
}


//Logout User: /api/user/logout
export const logout = async(req,res) =>{
  try{
   res.clearCookie('token',{
    httpOnly:true,
    secure : process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ?'none' : 'strict',
   });
   return res.json({
    success:true,
    message:"User cookies Logged Out",
   })
  }
  catch(error){
    console.log(error.message);
    res.json({
      success:false,
      message:error.message,
    })

  }
}