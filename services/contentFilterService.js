// services/contentFilterService.js
import ContentFilter from '../models/ContentFilter.js';

class ContentFilterService {
  // Récupère les règles de filtrage d'un enfant
  static async getContentFilter(childId) {
    return await ContentFilter.findOne({ child: childId });
  }

  // Met à jour la liste noire et la liste blanche
  static async updateLists(childId, blacklist, whitelist) {
    let contentFilter = await ContentFilter.findOne({ child: childId });

    if (!contentFilter) {
      contentFilter = new ContentFilter({ child: childId, blacklist, whitelist });
    } else {
      contentFilter.blacklist = blacklist;
      contentFilter.whitelist = whitelist;
    }

    await contentFilter.save();
    return contentFilter;
  }

  // Met à jour les catégories bloquées
  static async updateCategories(childId, blockedCategories) {
    const contentFilter = await ContentFilter.findOne({ child: childId });

    if (!contentFilter) {
      throw new Error("Aucune règle de filtrage trouvée.");
    }

    contentFilter.blockedCategories = blockedCategories;
    await contentFilter.save();
    return contentFilter;
  }

  // Vérifie si un site est bloqué
  static async isBlocked(childId, url) {
    const contentFilter = await ContentFilter.findOne({ child: childId });

    if (!contentFilter) {
      return false; // Pas de filtre activé
    }

    const { blacklist, whitelist } = contentFilter;

    if (whitelist.includes(url)) return false; // Autorisé explicitement
    if (blacklist.includes(url)) return true; // Bloqué explicitement

    return false; // Par défaut, non bloqué
  }
}

export default ContentFilterService;
