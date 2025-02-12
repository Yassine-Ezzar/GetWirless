import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
    const { parentId } = req.body; // ID du parent

    // Vérifier si le parent existe
    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(400).json({ message: "Parent introuvable" });
    }

    // Générer un code unique pour l'enfant (par exemple, un code aléatoire)
    const childCode = "MMFD" + Math.random().toString(36).substring(2, 7).toUpperCase();

    // Créer l'enfant avec le code d'enfant et l'ID du parent
    const newChild = new User({
      role: "child",
      childCode,
      parentId: parent._id,
    });

    // Sauvegarder l'enfant dans la base de données
    await newChild.save();

    // Retourner le code d'enfant généré
    res.json({ childCode });
  } catch (error) {
    console.error("Erreur lors de la génération du code d'enfant :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const loginChild = async (req, res) => {
  try {
    const { childCode } = req.body;
    
    // Log pour voir le code envoyé
    console.log("Code d'enfant reçu : ", childCode);

    // Vérifier si un enfant avec ce code existe
    const child = await User.findOne({ childCode });

    // Log pour vérifier si l'enfant a été trouvé
    console.log("Enfant trouvé dans la base de données : ", child);

    if (!child) {
      // Si l’enfant n’est pas trouvé, vérifier si c’est un parent avec ce code
      const parent = await User.findOne({ childCode });

      // Log pour vérifier si le parent a été trouvé
      console.log("Parent trouvé : ", parent);

      if (!parent) {
        // Si aucun parent n’est trouvé avec ce code, renvoyer un message d’erreur
        return res.status(400).json({ message: "Code invalide" });
      }

      // Si un parent est trouvé, créer un enfant associé
      const newChild = new User({
        role: "child",
        childCode,
        parentId: parent._id,
      });

      // Sauvegarder le nouvel enfant
      await newChild.save();

      // Générer un token JWT pour le nouvel enfant
      const token = jwt.sign({ id: newChild._id, role: newChild.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

      // Retourner le token et l'ID de l'enfant
      return res.json({ token, userId: newChild._id });
    }

    // Si l'enfant existe déjà, générer un token JWT
    const token = jwt.sign({ id: child._id, role: child.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Retourner le token et l'ID de l'enfant
    res.json({ token, userId: child._id });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'enfant :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const getUserProfile = (req, res) => {
    // `req.user` contient l'utilisateur authentifié grâce au middleware `authenticate`
    const user = req.user; 
    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  };
  
export const registerParentController = async (req, res) => {
  try {
    const token = await registerParent(req.body.email, req.body.password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};