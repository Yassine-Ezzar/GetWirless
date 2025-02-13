// routes/contentFilterRoutes.js
import express from 'express';
import ContentFilterController from '../controllers/contentFilterController.js';

const router = express.Router();

// Récupérer les règles de filtrage d'un enfant
router.get('/:childId', ContentFilterController.getContentFilter);

// Mettre à jour la liste noire et la liste blanche
router.put('/:childId/lists', ContentFilterController.updateLists);

// Mettre à jour les catégories bloquées
router.put('/:childId/categories', ContentFilterController.updateCategories);

export default router;
