// middleware/proxyMiddleware.js
import ContentFilterService from '../services/contentFilterService.js';

const proxyMiddleware = async (req, res, next) => {
  const { childId } = req.user;
  const url = req.body.url; 

  if (!childId || !url) {
    return res.status(400).json({ message: "Requête invalide." });
  }

  const isBlocked = await ContentFilterService.isBlocked(childId, url);

  if (isBlocked) {
    return res.status(403).json({ message: "Accès refusé : site bloqué." });
  }

  next();
};

export default proxyMiddleware;
