import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken?.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        success: false,
      });
    }

    req.userId = decodedToken.userId; // More standard than req.id
    next();
  } catch (error) {
    console.error("Auth Error:", error); // Log full error for debugging
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
