import ContentFilter from '../models/ContentFilter.js';

class ContentFilterService {
  static async getContentFilter(childId) {
    return await ContentFilter.findOne({ child: childId });
  }

  static async updateLists(childId, blacklist, whitelist) {
    let contentFilter = await ContentFilter.findOneAndUpdate(
      { child: childId },
      { blacklist, whitelist },
      { new: true, upsert: true }
    );
    return contentFilter;
  }

  static async updateCategories(childId, blockedCategories) {
    const contentFilter = await ContentFilter.findOneAndUpdate(
      { child: childId },
      { blockedCategories },
      { new: true }
    );
    if (!contentFilter) throw new Error("Aucune règle de filtrage trouvée.");
    return contentFilter;
  }

  static async isBlocked(childId, url) {
    const contentFilter = await ContentFilter.findOne({ child: childId });

    if (!contentFilter) return false;

    const { blacklist, whitelist } = contentFilter;
    if (whitelist.includes(url)) return false;
    if (blacklist.includes(url)) return true;

    return false;
  }
}

export default ContentFilterService;
