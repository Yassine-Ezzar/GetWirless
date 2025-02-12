import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware pour l'authentification de l'utilisateur (Parent)
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Accès non autorisé" });

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide" });
  }
};
