import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const registerParent = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const parent = new User({ email, password: hashedPassword, role: "parent" });
  await parent.save();
  return generateToken(parent._id);
};

export const loginParent = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || user.role !== "parent") throw new Error("Identifiants invalides");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Identifiants invalides");

  return generateToken(user._id);
};
