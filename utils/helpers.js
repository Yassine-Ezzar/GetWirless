export const checkAlert = (app) => {
    if (app.usageTime > app.dailyLimit && app.dailyLimit > 0) {
      console.log(`⚠️ Alerte: ${app.appName} dépasse la limite quotidienne!`);
    }
  };
  
  export const formatStats = (apps) => {
    return apps.map(app => ({
      appName: app.appName,
      usageTime: app.usageTime,
      dailyLimit: app.dailyLimit,
      blocked: app.blocked
    }));
  };

  export const detectRiskyKeywords = (content) => {
    const riskyKeywords = [
      'harasselement', 
    ];
    const words = content.toLowerCase().split(/\s+/);
    return riskyKeywords.filter((keyword) => words.includes(keyword));
  };