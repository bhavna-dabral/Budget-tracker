import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // 🧩 Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Attach user data to request (most importantly user ID)
    req.user = {
      id: decoded.id || decoded._id, // handle both formats
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default authUser;
