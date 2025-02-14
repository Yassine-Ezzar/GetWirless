import ContentFilterService from '../services/contentFilterService.js';

const proxyMiddleware = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Utilisateur non authentifié." });

  const { childId } = req.user;
  const { url } = req.body;

  if (!childId || !url) return res.status(400).json({ message: "Requête invalide." });

  const isBlocked = await ContentFilterService.isBlocked(childId, url);

  if (isBlocked) return res.status(403).json({ message: "Accès refusé : site bloqué." });

  next();
};

export default proxyMiddleware;
