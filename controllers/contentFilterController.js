// controllers/contentFilterController.js
import ContentFilterService from '../services/contentFilterService.js';

class ContentFilterController {
  // Récupérer les règles de filtrage
  static async getContentFilter(req, res) {
    try {
      const { childId } = req.params;
      const contentFilter = await ContentFilterService.getContentFilter(childId);

      if (!contentFilter) {
        return res.status(404).json({ message: "Aucune règle de filtrage trouvée." });
      }

      return res.status(200).json(contentFilter);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Mettre à jour la liste noire et la liste blanche
  static async updateLists(req, res) {
    try {
      const { childId } = req.params;
      const { blacklist, whitelist } = req.body;

      const contentFilter = await ContentFilterService.updateLists(childId, blacklist, whitelist);
      return res.status(200).json(contentFilter);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Mettre à jour les catégories bloquées
  static async updateCategories(req, res) {
    try {
      const { childId } = req.params;
      const { blockedCategories } = req.body;

      const contentFilter = await ContentFilterService.updateCategories(childId, blockedCategories);
      return res.status(200).json(contentFilter);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default ContentFilterController;
