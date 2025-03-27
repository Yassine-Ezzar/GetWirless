import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendPasswordResetEmail } from "../services/emailService.js";
import crypto from "crypto";

dotenv.config();


export const registerParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const parent = new User({
      email,
      password: hashedPassword,
      role: "parent",
    });

    await parent.save();
    res.status(201).json({ message: "Compte parent créé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.role !== "parent") return res.status(400).json({ message: "Identifiants invalides" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Identifiants invalides" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const generateChildCode = async (req, res) => {
  try {
    const { parentId } = req.body;
    const parent = await User.findById(parentId);
    if (!parent) return res.status(400).json({ message: "Parent introuvable" });

    const childCode = "MMFD" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newChild = new User({
      role: "child",
      childCode,
      parentId: parent._id,
    });

    await newChild.save();
    res.json({ childCode });
  } catch (error) {
    console.error("Erreur lors de la génération du code d'enfant :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const loginChild = async (req, res) => {
  try {
    const { childCode } = req.body;
    const child = await User.findOne({ childCode });

    if (!child) {
      const parent = await User.findOne({ childCode });
      if (!parent) return res.status(400).json({ message: "Code invalide" });

      const newChild = new User({
        role: "child",
        childCode,
        parentId: parent._id,
      });

      await newChild.save();
      const token = jwt.sign({ id: newChild._id, role: newChild.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, userId: newChild._id });
    }

    const token = jwt.sign({ id: child._id, role: child.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: child._id });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'enfant :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const getUserProfile = (req, res) => {
  const user = req.user;
  res.status(200).json({
    id: user._id,
    email: user.email,
    role: user.role,
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, "Réinitialisation de mot de passe", `Cliquez ici pour réinitialiser votre mot de passe : ${resetUrl}`);

    res.json({ message: "Lien de réinitialisation envoyé par email" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
