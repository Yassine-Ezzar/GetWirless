import express from 'express';
import proxyMiddleware from '../middlewares/proxyMiddleware.js';

const router = express.Router();

// Vérifier si un site est bloqué avant d'accéder à l'URL
router.post('/', proxyMiddleware, (req, res) => {
  res.status(200).json({ message: "Accès autorisé." });
});

export default router;
