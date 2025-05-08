import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const bidderAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ msg: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.bidderId) {
      return res.status(403).json({ msg: "Invalid token payload" });
    }

    req.bidderId = decoded.bidderId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default bidderAuth;
