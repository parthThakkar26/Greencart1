import jwt from "jsonwebtoken";

//Login seller: /api/seller/login
export const sellerLogin = async (req, res) => {

    try{
          const { email, password } = req.body;

  if (
    password === process.env.SELLER_PASSWORD &&
    email === process.env.SELLER_EMAIL
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("sellerToken", token, {
      httpOnly: true, //Prevent the javascript to access cookie
      secure: process.env.NODE_ENV === "production", //true //use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //secure from CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // expiration time cookie
    });

    return res.json({
        success:true,
        message:"Logged In seller",
    })
  }

  else{
    return res.json({
        success:false,
        message:"Invalid Details",
    })
  }
    }

    catch(error)
    {
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }


};

//seller Auth : /api/seller/is-auth
export const isSellerAuth = async (req,res) =>{

    try{
       

        return res.json({
            success:true,
            
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



//Logout Seller: /api/seller/logout
export const sellerLogout = async(req,res) =>{
  try{
   res.clearCookie('sellerToken',{
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