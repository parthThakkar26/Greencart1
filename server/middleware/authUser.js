import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // Ensure req.body exists
      if (!req.body)
         req.body = {};
      
      req.body.userId = tokenDecode.id;
      next();
    } else {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
