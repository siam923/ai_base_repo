// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { getOrCreateUser } from "#src/services/userService.js";
import User from "#src/models/User.js";
/**
 * Verifies the JWT access token.
 * @param {String} accessToken - The JWT access token.
 * @returns {Object} - The verification result.
 */
const verifyAccessToken = (accessToken) => {
  const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN || "";
  try {
    const decoded = jwt.verify(accessToken, secretKey);
    return { status: "SUCCESS", data: decoded };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { status: "FAIL", message: "Invalid Token" };
  }
};

/**
 * Authentication middleware to protect routes.
 * It verifies the access token, retrieves or creates a user,
 * and attaches the user model's _id to the request object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticator = async (req, res, next) => {
  try {
    const accessToken = req.headers["accesstoken"];


    if (!accessToken || typeof accessToken !== "string") {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decode = verifyAccessToken(accessToken);

    if (decode.status === "FAIL") {
      return res.status(401).json({ error: decode.message });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (!decode.data || (decode.data.exp && decode.data.exp < currentTime)) {
      return res.status(401).json({ error: "Unauthorized: Token is expired" });
    }

    const userId = decode.data._id; // Assuming the token contains the user's _id
    const companyId = decode.data.companyId;

    if (!userId || !companyId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid Token Data" });
    }

    // Extract projectId from req.body or req.query

    // Get or create the user based on companyId, projectId, and userId
    const userModel = await getOrCreateUser({ companyId,  userId });
    req.user = {
      id: userModel._id,
      companyId: userModel.companyId,
    };

    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid Token" });
  }
};

export default authenticator;
