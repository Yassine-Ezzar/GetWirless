import User from "../models/user.js";

// Service pour créer un enfant (en fait, cela pourrait être une logique plus complexe plus tard)
export const createChildService = async (parentId, childCode) => {
  const parent = await User.findById(parentId);
  if (!parent || parent.role !== "parent") throw new Error("Parent introuvable");

  const existingChild = await User.findOne({ childCode });
  if (existingChild) throw new Error("Code d'enfant déjà utilisé");

  const newChild = new User({
    role: "child",
    childCode,
    parentId: parent._id,
  });

  await newChild.save();
  return newChild;
};
