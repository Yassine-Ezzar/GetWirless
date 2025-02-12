import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Créer un enfant (généralement après la génération du code)
export const createChild = async (req, res) => {
  try {
    const { parentId, childCode } = req.body;

    // Vérifier que le parent existe
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ message: "Parent introuvable ou non valide" });
    }

    const existingChild = await User.findOne({ childCode });
    if (existingChild) {
      return res.status(400).json({ message: "Code d'enfant déjà utilisé" });
    }

    // Créer un nouvel enfant
    const newChild = new User({
      role: "child",
      childCode,
      parentId: parent._id,
    });

    await newChild.save();
    res.status(201).json({ message: "Enfant créé avec succès", child: newChild });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un enfant par son ID
export const getChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const child = await User.findById(childId);

    if (!child || child.role !== "child") {
      return res.status(404).json({ message: "Enfant introuvable" });
    }

    res.status(200).json({ child });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Modifier un enfant (ex : mettre à jour son code)
export const updateChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const { childCode } = req.body;

    const child = await User.findById(childId);
    if (!child || child.role !== "child") {
      return res.status(404).json({ message: "Enfant introuvable" });
    }

    child.childCode = childCode || child.childCode;
    await child.save();
    res.status(200).json({ message: "Enfant mis à jour avec succès", child });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un enfant
export const deleteChild = async (req, res) => {
  try {
    const { childId } = req.params;

    const child = await User.findById(childId);
    if (!child || child.role !== "child") {
      return res.status(404).json({ message: "Enfant introuvable" });
    }

    await child.remove();
    res.status(200).json({ message: "Enfant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
